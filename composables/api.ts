let base_url = "";

// local
if (process.env.NODE_ENV !== "production") {
    base_url = "http://localhost:8000"
} else {
    // production server
    if (process.server) {
        // server-side rendering
        base_url = "http://localhost:8000"
    }
}


export const BASE_URL = base_url;
