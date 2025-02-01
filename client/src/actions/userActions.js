export async function register(previousState, formData) {
  try {
    const email = formData.get("email");
    const password = formData.get("password");

    console.log("Data being sent:", JSON.stringify({ email, password }));

    const res = await fetch("http://localhost:3000/api/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }), // Send only email and password
    });

    if (!res.ok) {
      const errorData = await res.json();
      const errorMessage = errorData?.error || `HTTP error ${res.status}`;
      console.error("API Error:", errorMessage);
      return { ...previousState, error: errorMessage, isPending: false };
    }

    const data = await res.json();
    console.log("API Success:", data);
    return { ...previousState, success: data, error: null, isPending: false };

  } catch (error) {
    console.error("Fetch/JSON Error:", error);
    return { ...previousState, error: "An unexpected error occurred.", isPending: false };
  }
}






export async function login(previousState, formData) {
  try {
    const email = formData.get("email");
    const password = formData.get("password");

    console.log("Data being sent:", JSON.stringify({ email, password }));

    const res = await fetch("http://localhost:3000/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials:"include",
      body: JSON.stringify({ email, password }), // Send only email and password
    });

    if (!res.ok) {
      const errorData = await res.json();
      const errorMessage = errorData?.error || `HTTP error ${res.status}`;
      console.error("API Error:", errorMessage);
      return { ...previousState, error: errorMessage, isPending: false };
    }

    const data = await res.json();
    console.log("API Success:", data);
    return { ...previousState, success: data, error: null, isPending: false };

  } catch (error) {
    console.error("Fetch/JSON Error:", error);
    return { ...previousState, error: "An unexpected error occurred.", isPending: false };
  }
}