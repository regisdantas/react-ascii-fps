import React from "react";
import PropTypes from "prop-types";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AccountTree } from "@mui/icons-material";
import "./Header.css";

const theme = createTheme({
  typography: {
    fontFamily: "Typewalk1915",
  },
});

function Header(props) {
  return (
    <ThemeProvider theme={theme}>
      <AppBar sx={{ zIndex: "2" }}>
        <Toolbar
          variant="dense"
          sx={{
            backgroundColor: "black",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                width: "70%",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "left",
                  padding: "5px 0px 0px",
                }}
              >
                <AccountTree sx={{ padding: "4px" }}></AccountTree>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: "bold",
                  }}
                  color="white"
                  gutterBottom
                >
                  {props.title}
                </Typography>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "left",
                  backgroundColor: "gold",
                  padding: "5px 8px 0px",
                  borderRadius: "25px",
                }}
              >
                {props.menu.map((item, index) => {
                  return (
                    <>
                      {" "}
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: "bold",
                        }}
                        color="black"
                        gutterBottom
                      >
                        {item}
                      </Typography>
                      {index < props.menu.length - 1 ? (
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: "bold",
                            padding: "0px 8px 0px",
                          }}
                          color="black"
                          gutterBottom
                        >
                          {"/"}
                        </Typography>
                      ) : (
                        <></>
                      )}
                    </>
                  );
                })}
              </div>
            </div>
          </div>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
}

Header.propTypes = {};

export default Header;
