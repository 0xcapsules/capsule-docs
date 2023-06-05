import React from "react";
import Layout from "@theme/Layout";

export default function Waitlist() {
  return (
    <Layout title="Capsuleverse Waitlist" description="Join The Capsuleverse Waitlist">
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: "20px", marginTop: "25px", marginBottom: "15px" }}>
          Sign up to receive a notification when Capsuleverse <br /> becomes available on iOS.
        </p>

        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSf4bNVz3gJ_gZMB8gVvjFcvBvpiH0Sn-B_FULK-IYzpaBgpjw/viewform?embedded=true"
          width="640"
          height="551"
          frameborder="0"
          marginheight="0"
          marginwidth="0"
        >
          Loading…
        </iframe>
      </div>
    </Layout>
  );
}
