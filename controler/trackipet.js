const axios = require("axios");
const querystring = require("querystring");

// Define constants
const user_name = "";
const password = "";
const server_url = "";
const client_id = "";
const client_secret = "";
const redirect_uri = "";

async function do_login_and_get_access_token() {
  try {
    // Perform login request
    const loginResponse = await axios.post(
      `${server_url}/api/internal/v2/user/login`,
      {
        username: user_name,
        password: password,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    console.log("Login response:", loginResponse.data);

    if (loginResponse.status !== 200) {
      throw new Error("Login failed");
    }

    // Extract cookies from response
    const cookies = loginResponse.headers["set-cookie"];

    // Perform OAuth request
    const oauthResponse = await axios.get(`${server_url}/api/v3/oauth2/auth`, {
      params: {
        client_id: client_id,
        redirect_uri: redirect_uri,
        response_type: "code",
        scope: "locations,notifications,devices,accounts,settings,geozones",
      },
      headers: { Cookie: cookies.join("; ") },
      maxRedirects: 0,
      validateStatus: (status) => status === 302,
    });

    console.log("OAuth response:", oauthResponse.headers);

    // Extract authorization code from response
    const location = oauthResponse.headers.location;
    const code = location.split("=")[1];

    // Request access token
    const tokenResponse = await axios.post(
      `${server_url}/api/v3/oauth2/token`,
      querystring.stringify({
        client_id: client_id,
        client_secret: client_secret,
        code: code,
        grant_type: "authorization_code",
        redirect_uri: redirect_uri,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: cookies.join("; "),
        },
      }
    );

    console.log("Token response:", tokenResponse.data);

    if (tokenResponse.status !== 200) {
      throw new Error("Failed to get access token");
    }

    // Return access token
    return tokenResponse.data.access_token;
  } catch (error) {
    console.error(
      "Error during login and token retrieval:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

async function get_user_details(access_token) {
  try {
    // Request user details
    const response = await axios.get(`${server_url}/api/v3/user`, {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error getting user details:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

async function get_account_descendants(access_token, account_id) {
  try {
    // Request account descendants
    const response = await axios.get(
      `${server_url}/api/v4/accounts/${account_id}/descendants`,
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error getting account descendants:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

async function update_device_settings(access_token, settings_id, account_id, settings) {
  try {
    // Update device settings
    const response = await axios.put(
      `${server_url}/api/v3/accounts/${account_id}/settings/${settings_id}`,
      settings,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(`Failed to update device settings: ${response.status}`);
    }
  } catch (error) {
    console.error(
      "Error updating device settings:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

async function ask_device_to_send_location(access_token, account_id, device_id) {
  try {
    // Request device to send location
    const response = await axios.post(
      `${server_url}/api/v3/accounts/${account_id}/devices/ops/getLocation`,
      {
        devices: [device_id],
        forceGpsRead: true,
        sendGsmBeforeLock: true,
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(`Failed to send location request: ${response.status}`);
    }
  } catch (error) {
    console.error(
      "Error sending location request:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

async function get_device_last_location_reports(access_token, account_id, device_id) {
  try {
    // Request last location reports of the device
    const response = await axios.post(
      `${server_url}/api/v3/accounts/${account_id}/locations/filter`,
      {
        device_ids: [device_id],
        limit: 2,
        forceGpsRead: true,
        sendGsmBeforeLock: true,
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Location response:", response.data);

    if (response.status !== 200) {
      throw new Error(`Failed to get last location reports: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error(
      "Error getting last location reports:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

// Export functions
module.exports = {
  do_login_and_get_access_token,
  get_user_details,
  get_account_descendants,
  update_device_settings,
  ask_device_to_send_location,
  get_device_last_location_reports,
};
