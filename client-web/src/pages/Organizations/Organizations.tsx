import React, { useEffect } from "react"

import {
  Box,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material"
import { FormikErrors, useFormik } from "formik"
import countries from "../../assets/countries.json"
import { LoadingButton } from "@mui/lab"
import { getSubscriptions, getUserCompany, httpWithAuth } from "../../http"
import { useSnackbar } from "../../context/SnackbarContext"
import { useStoreState } from "../../store"
import { useHistory, useLocation } from "react-router"
type Properties = {}
interface FormValues {
  companyName: string
  companyAddress: string
  town: string
  region: string
  postCode: string
  country: string
  businessPhoneNumber: string
  companyRegistrationNumber: string
  taxNumber: string
}

const validate = (values: FormValues): FormikErrors<FormValues> => {
  const errors: FormikErrors<FormValues> = {}
  for (const [key, value] of Object.entries(values)) {
    if (value.length < 3 && key !== "companyRegistrationNumber") {
      errors[key] = "Must be 3 characters or more"
    }
    if (value.length < 5 && key === "companyAddress") {
      errors[key] = "Must be 3 characters or more"
    }
  }
  return errors
}
const Organizations: React.FC<Properties> = ({}) => {
  const { showSnackbar } = useSnackbar()
  const setUser = useStoreState((s) => s.setUser)
  const location = useLocation()
  const user = useStoreState((s) => s.user)
  const history = useHistory()
  const getCompany = async () => {
    const res = await getUserCompany(user.token)
    setUser({ ...user, company: res.data.result })
  }
  const payment = new URLSearchParams(location.search).get("payment")

  const getUserSubscriptions = async () => {
    try {
      const res = await getSubscriptions()
      console.log(res.data)
      setUser({
        ...user,
        paymentMethods: res.data.paymentMethods,
        subscriptions: res.data.subscriptions,
      })
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    if (payment === "success") {
      showSnackbar("success", "Success! Payment received.")
    }
    getUserSubscriptions()
  }, [])

  const formik = useFormik<FormValues>({
    initialValues: {
      companyName: "",
      companyAddress: "",
      town: "",
      region: "",
      postCode: "",
      country: countries[0].name,
      businessPhoneNumber: "",
      companyRegistrationNumber: "",
      taxNumber: "",
    },

    validate,

    onSubmit: async (
      {
        companyAddress,
        companyName,
        companyRegistrationNumber,
        businessPhoneNumber,
        region,
        town,
        postCode,
        country,
        taxNumber,
      },
      { setSubmitting, resetForm }
    ) => {
      const body = {
        name: companyName,
        address: companyAddress,
        town: town,
        regionOrState: region,
        postCode: postCode,
        country: country,
        phoneNumber: businessPhoneNumber,
        registrationNumber: companyRegistrationNumber,
        payeReference: taxNumber,
      }
      setSubmitting(true)
      try {
        const res = await httpWithAuth().post("/company/", body)
        await getCompany()
        if (user.subscriptions.data.length > 0) {
          history.push("/")
        } else {
          history.push("/payments")
        }
        showSnackbar("success", "Company added")
      } catch (error) {
        showSnackbar("error", "Something went wrong")
        console.log(error)
      }

      resetForm()
      setSubmitting(false)
    },
  })

  useEffect(() => {
    getCompany()
  }, [])

  return (
    <Container maxWidth="xl">
      <Box sx={{ width: "70%", margin: "auto", mt: 2 }}>
        <Typography sx={{ fontWeight: "bold", fontSize: 24 }} variant={"h2"}>
          Company Details
        </Typography>
      </Box>
      <Box>
        <form
          onSubmit={formik.handleSubmit}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            width: "100%",
            padding: "20px 0",
            gap: 20,
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr", md: "1fr 1fr" },
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              width: "70%",
              gap: 2,
            }}
          >
            <TextField
              label="Company Name"
              name="companyName"
              fullWidth
              variant="outlined"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.companyName}
              error={
                !!formik.touched.companyName && !!formik.errors.companyName
              }
            />
            <TextField
              label="Company Address"
              name="companyAddress"
              fullWidth
              variant="outlined"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.companyAddress}
              error={
                !!formik.touched.companyAddress &&
                !!formik.errors.companyAddress
              }
            />
            <TextField
              label="Town"
              name="town"
              fullWidth
              variant="outlined"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.town}
              error={!!formik.touched.town && !!formik.errors.town}
            />
            <TextField
              label="Region or State"
              name="region"
              fullWidth
              variant="outlined"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.region}
              error={!!formik.touched.region && !!formik.errors.region}
            />
            <TextField
              label="Post/Zip code"
              name="postCode"
              fullWidth
              variant="outlined"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.postCode}
              error={!!formik.touched.postCode && !!formik.errors.postCode}
            />

            <FormControl fullWidth>
              <InputLabel id="country-label">Country</InputLabel>
              <Select
                labelId="country-label"
                value={formik.values.country}
                name={"country"}
                label="Country"
                onChange={formik.handleChange}
              >
                {countries.map((country) => {
                  return (
                    <MenuItem value={country.name} key={country.name}>
                      {country.name}
                    </MenuItem>
                  )
                })}
              </Select>
            </FormControl>
            <TextField
              label="Business Phone Number"
              name="businessPhoneNumber"
              fullWidth
              variant="outlined"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.businessPhoneNumber}
              error={
                !!formik.touched.businessPhoneNumber &&
                !!formik.errors.businessPhoneNumber
              }
            />
            <TextField
              label="Company Registration Number"
              name="companyRegistrationNumber"
              fullWidth
              variant="outlined"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.companyRegistrationNumber}
              error={
                !!formik.touched.companyRegistrationNumber &&
                !!formik.errors.companyRegistrationNumber
              }
            />
            <TextField
              label="Tax Number"
              name="taxNumber"
              sx={{ gridColumn: { md: "1/3" } }}
              fullWidth
              variant="outlined"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.taxNumber}
              error={!!formik.touched.taxNumber && !!formik.errors.taxNumber}
            />
          </Box>
          <Box>
            <LoadingButton
              loading={formik.isSubmitting}
              variant="outlined"
              type="submit"
            >
              Save Changes
            </LoadingButton>
          </Box>
        </form>
      </Box>
    </Container>
  )
}

export default Organizations
