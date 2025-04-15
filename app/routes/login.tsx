// import { json, type LoaderFunctionArgs } from "@remix-run/node";
// import { Form, useLoaderData } from "@remix-run/react";
import React from "react";
// Replace Form with a standard HTML form for now, or import Form from react-router-dom if needed later

// Remove loader function for now
// export async function loader({ request }: LoaderFunctionArgs) {
//   // Add any server-side logic needed for the login page here
//   // e.g., check if the user is already logged in
//   return json({ message: "Please log in" });
// }

export default function LoginPage() {
  // Remove useLoaderData for now
  // const data = useLoaderData<typeof loader>();

  // Simple message for now
  const message = "Please log in";

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Login</h1>
      {/* <p>{data.message}</p> */}
      <p>{message}</p>
      {/* Replace Remix Form with standard form */}
      {/* <Form method="post"> */}
      <form method="post">
        {" "}
        {/* Or potentially import Form from 'react-router-dom' later */}
        <div>
          <label>
            Email: <input type="email" name="email" required />
          </label>
        </div>
        <div>
          <label>
            Password: <input type="password" name="password" required />
          </label>
        </div>
        <button type="submit">Log In</button>
        {/* </Form> */}
      </form>
      {/* Add links for password recovery or sign up if needed */}
    </div>
  );
}

// Remove Remix action function for now
// Add an action function to handle the form submission
// export async function action({ request }: ActionFunctionArgs) {
//   const formData = await request.formData();
//   const email = formData.get("email");
//   const password = formData.get("password");
//
//   // ... handle login logic
//
//   return redirect("/"); // Redirect on successful login
// }
