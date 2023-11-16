import React, { useEffect } from "react";
import { useState } from "react";
import { useFormik } from "formik";
import DailyTask from "./DailyTask";
import { useNavigate, Link } from "react-router-dom";
import Animation from "./PetAnimation";
import {
  Button,
  Container,
  CssBaseline,
  Box,
  Grid,
  Typography,
} from "@mui/material";
import { petSchema } from "../validations/petNameValidations";
import { useApi } from "../ContextAPI/APIContext";
import Products from "./Products";
import CustomSnackbar from "./CustomSnackbar";
import useSnackbar from "../hooks/useSnackbar";
import { RenderTextField } from "./InputFields";
import BackDrop from "./Backdrop";

const UserData = () => {
  const navigate = useNavigate();
  const { restAPI } = useApi();
  const snackbar = useSnackbar();
  const [userData, setUserdata] = useState(null);
  const [loader, setLoader] = useState(true);
  const [reload, setReload] = useState(0);
  const [gif, setGif] = useState(null);

  useEffect(() => {
    const bleh = localStorage.getItem("Are_you_in");
    if (!bleh) {
      navigate("/");
    }
    const url = `/protected/userData`;
    restAPI
      .get(url)
      .then((response) => {
        try {
          setUserdata(response.data);
          setGif(response.data.pet.recentImage);
          setLoader(false);
        } catch (error) {
          setLoader(true);
        }
      })
      .catch((error) => {
        if (error && error.response && error.response.data) {
          snackbar.showError(error.response.data);
        }
      });
  }, [reload]);

  //petName form
  const formik = useFormik({
    initialValues: {
      petName: "",
    },
    validationSchema: petSchema,
    onSubmit: (values) => {
      restAPI
        .post("/protected/petName", values)
        .then((response) => {
          setLoader(false);
          setReload(reload + 1);
        })
        .catch((error) => {
          setLoader(false);
          if (error && error.response && error.response.data) {
            snackbar.showError(error.response.data);
          }
        });
    },
  });

  if (loader) {
    return <BackDrop loader={loader} />;
  } else if (!userData.pet.petName) {
    return (
      <>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h5">
              Welcome {userData.name} Name your Pet
            </Typography>
            <BackDrop loader={loader} />
            <Box sx={{ mt: 3 }}>
              <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <RenderTextField
                      id="petName"
                      label="Pet Name"
                      type="string"
                      formik={formik}
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Update
                </Button>
              </form>
              <CustomSnackbar snackbarProp={snackbar} />
            </Box>
          </Box>
        </Container>
      </>
    );
  } else {
    return (
      <>
        <Grid container spacing={1}>
          <Grid item xs={3}>
            <Products
              reloadParent={setReload}
              rewards={userData.rewards}
              reload={reload}
            />
          </Grid>
          <Grid item xs={6}>
            <div className="home center">
              <span>
                <h2>{userData.pet.petName}</h2>
                <Link to="/petRename" className="links">
                  Rename Pet
                </Link>
              </span>
              <Animation gif={gif} />
            </div>
          </Grid>
          <Grid item xs={3}>
            <DailyTask userData={userData} />
          </Grid>
        </Grid>
        <CustomSnackbar snackbarProp={snackbar} />
      </>
    );
  }
};

export default UserData;
