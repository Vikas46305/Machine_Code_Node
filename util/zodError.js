function ZodError(ZodResult,res) {
    return res.status(400).json({
        message: "Zoderror",
        success: false,
        error: Object.values(ZodResult.error.flatten().fieldErrors).flat()
    })
}
export default ZodError;