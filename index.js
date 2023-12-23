const express = require("express");
const session = require("express-session");
const passport = require("passport");
require("./auth");

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

const app = express();
app.use(session({ secret: "cats" }));
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send(`
    <form action="/auth/google" method="get">
    <br />
    <button type="submit">Google Login</button>
</form>
    `);
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/protected",
    failureRedirect: "/auth/failure",
  })
);

app.get("/auth/failure", (req, res) => {
  res.send("Something went wrong...");
});

app.get("/protected", isLoggedIn, (req, res) => {
  res.send(`
        <p>Hello ${req.user.displayName}</p>
        <form action="/logout" method="get">
            <button type="submit">Logout</button>
        </form>
    `);
});

app.get("/logout", (req, res) => {
  // Use req.logout() with a callback function
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy();
    res.send(`
            <p>Goodbye!</p>
            <form action="/" method="get">
                <button type="submit">Back To Home</button>
            </form>
        `);
  });
});

app.listen(5000, () => console.log("Listening on: 5000"));
