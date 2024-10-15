import React from "react"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import CloseIcon from "@mui/icons-material/Close"
import { useFormik } from "formik"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import { useWeb3React } from "@web3-react/core"
import { registerSignature, TLoginSuccessResponse } from "../../http"
import { useHistory } from "react-router-dom"
import { useStoreState } from "../../store"

type TProperties = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  updateUser: (data: TLoginSuccessResponse) => void
}

const validate = (values: Record<string, string>) => {
  const errors: Record<string, string> = {}

  if (!values.firstName) {
    errors.firstName = "Required"
  }

  if (!values.lastName) {
    errors.lastName = "Required"
  }

  return errors
}

export function MetamaskModal({ open, setOpen, updateUser }: TProperties) {
  const { account, library, deactivate } = useWeb3React()
  const setUser = useStoreState((state) => state.setUser)
  const history = useHistory()
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
    },
    validate,
    onSubmit: async (values) => {
      const signer = library.getSigner()
      try {
        const message = "Register"
        const signature = await signer.signMessage(message)
        const resp = await registerSignature(
          account as string,
          signature,
          message,
          values.firstName,
          values.lastName
        )
        const user = resp.data.user
        updateUser(resp.data)
        deactivate()
        history.push(`/profile/${user.defaultWallet.walletAddress}`)
      } catch (error) {
        console.log("signature error", error)
      }
    },
  })

  return (
    <Dialog onClose={() => setOpen(false)} maxWidth={false} open={open}>
      <Box style={{ width: "350px" }}>
        <DialogTitle
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          Continue with Metamask
          <IconButton onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Box sx={{ width: "100%", typography: "body1", padding: 1 }}>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              margin="dense"
              inputProps={{
                autoComplete: "off",
              }}
              label="First Name"
              name="firstName"
              type="text"
              fullWidth
              variant="standard"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.firstName && Boolean(formik.errors.firstName)
              }
              helperText={
                formik.touched.firstName && formik.errors.firstName
                  ? formik.errors.firstName
                  : ""
              }
            />
            <TextField
              margin="dense"
              label="Last Name"
              name="lastName"
              type="text"
              fullWidth
              inputProps={{
                autoComplete: "off",
              }}
              variant="standard"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.lastName && Boolean(formik.errors.lastName)}
              helperText={
                formik.touched.lastName && formik.errors.lastName
                  ? formik.errors.lastName
                  : ""
              }
            />
            <Box sx={{ margin: 2, display: "flex", justifyContent: "center" }}>
              <Button type="submit" variant="contained">
                Register
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </Dialog>
  )
}
