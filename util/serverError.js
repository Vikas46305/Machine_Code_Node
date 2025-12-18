function ServerError(error, res) {
    console.log(error)
    return res.status(500).json({
        message: "Internal server error",
        success: false,
    })
}
export default ServerError;