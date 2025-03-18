const fs = require("fs");

const uploadProctoringImage = async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ msg: "No image provided" });

    const base64Data = image.replace(/^data:image\/jpeg;base64,/, "");
    fs.writeFileSync(`uploads/proctor_${Date.now()}.jpg`, base64Data, "base64");

    res.json({ msg: "Image received for proctoring" });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

module.exports = { uploadProctoringImage };
