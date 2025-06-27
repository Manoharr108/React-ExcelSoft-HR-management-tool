const roperation = require("../models/remarks")

exports.GetRemarks = async(req,res)=>{
    const quarter = req.params.quarter
    const data = await roperation.find({quarter})
    if(data) return res.json(data)
    else return res.status(500).json({message:"something went wrong!!"})
}


exports.AddandEditRemarks = async(req, res) => {
  try {
    const { quarter, category, text } = req.body;

    if (!quarter || !category || !text) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Upsert logic: if remark for (quarter + category) exists, update it; else, create
    const updated = await roperation.findOneAndUpdate(
      { quarter, category },
      { text },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      message: "Remarks saved successfully!",
      data: updated
    });
  } catch (err) {
    console.error("Error in AddRemarks:", err);
    return res.status(500).json({ message: "Server error while saving remarks." });
  }
};
