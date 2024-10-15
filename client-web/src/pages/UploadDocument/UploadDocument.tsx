import React, { useRef, useState } from "react"
import { Box, Button, FormHelperText, TextField } from "@mui/material"
import { useFormik } from "formik"
import * as http from "../../http"
import { useSnackbar } from "../../context/SnackbarContext"

export interface IUploadDocument {}

const UploadDocument: React.FC<IUploadDocument> = ({}) => {
  const [loading, setLoading] = useState(false)
  const fileReference = useRef<HTMLInputElement>(null)
  const { showSnackbar } = useSnackbar()
  const [uploadedFile, setUploadedFile] = useState({
    _id: "",
    createdAt: "",
    expiresAt: 0,
    filename: "",
    isVisible: true,
    location: "",
    locationPreview: "",
    mimetype: "",
    originalname: "",
    ownerKey: "",
    size: 0,
    updatedAt: "",
    userId: "",
  })

  const formik = useFormik({
    initialValues: {
      documentName: "",
      file: null,
    },
    validate: (values) => {
      const errors: Record<string, string> = {}

      if (!values.documentName) {
        errors.documentName = "Required"
      }

      if (!uploadedFile) {
        errors.file = "File required"
      }

      return errors
    },
    onSubmit: async (values) => {
      setLoading(true)
      try {
        const fileLocation = uploadedFile.location
        const documentUploadRest = await http.httpWithAuth().post("/docs", {
          documentName: values.documentName,
          files: [fileLocation],
        })
        showSnackbar("success", "Document uploaded successfully")

        setLoading(false)
      } catch (error) {
        console.log(error)
        showSnackbar("error", "Uploading failed")

        setLoading(false)
      }
    },
  })

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true)
    console.log(e)
    try {
      const fd = new FormData()
      fd.append("files", e.target.files[0])
      const fileUploadResp = await http.httpWithAuth().post("/files", fd)
      setUploadedFile(fileUploadResp.data.results[0])
      formik.setValues(fileUploadResp.data.results[0])
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }
  return (
    <Box>
      <Box sx={{ width: "100%" }}>
        <Box
          sx={{
            width: "50%",
            typography: "body1",
            padding: 1,
            margin: "auto",
          }}
        >
          <form style={{ flex: "1" }} onSubmit={formik.handleSubmit}>
            <Box
              style={{
                padding: "10px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: uploadedFile.locationPreview ? "end" : "center",
                border: uploadedFile.locationPreview
                  ? "none"
                  : "1px solid gray",
                borderRadius: "10px",
                height: "300px",
                backgroundImage: uploadedFile.locationPreview
                  ? `url(${uploadedFile.locationPreview})`
                  : "none",
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              <input
                onChange={onFileChange}
                ref={fileReference}
                type="file"
                style={{ display: "none" }}
              />
              <Button
                disabled={loading}
                id="uploadFile"
                color="secondary"
                variant="contained"
                onClick={() => fileReference?.current?.click()}
              >
                Upload File
              </Button>
            </Box>

            {formik.touched.file && formik.errors.file && (
              <FormHelperText error>
                {formik.errors.file as string}
              </FormHelperText>
            )}
            <TextField
              margin="dense"
              inputProps={{
                autoComplete: "off",
              }}
              label="Document Name"
              name="documentName"
              id="documentName"
              type="text"
              fullWidth
              variant="standard"
              onChange={(e) => {
                formik.handleChange(e)
              }}
              onBlur={formik.handleBlur}
              error={
                formik.touched.documentName &&
                Boolean(formik.errors.documentName)
              }
              helperText={
                formik.touched.documentName && formik.errors.documentName
                  ? formik.errors.documentName
                  : ""
              }
            />
            <Box sx={{ margin: 2, display: "flex", justifyContent: "center" }}>
              <Button
                id="submitUpload"
                disabled={loading}
                type="submit"
                variant="contained"
              >
                Create
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
  )
}
export default UploadDocument
