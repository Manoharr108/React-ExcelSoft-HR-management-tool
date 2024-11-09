const operation = require("../models/emplyoee");

exports.AddEmplyoee =async(req, res)=>{
    try{
        let newemp = await operation.create(req.body);
        return res.status(201).json(newemp);
    }
    catch(err){
        return res.status(500).json({message:err.message});
    }
}
exports.EmplyoeeWithId =async(req, res)=>{
    let {empid} = req.params;
    try{
        let newemp = await operation.find({empid:empid});
        return res.status(201).json(newemp);
    }
    catch(err){
        return res.status(500).json({message:err.message});
    }
}

exports.DeleteEmplyoee = async(req, res)=>{
    let {id} = req.params;
    try {
        // let emp = await operation.deleteMany({_id:id});
        let emp = await operation.findOneAndDelete({_id:id});
        return res.status(200).json({message:"Successfully deleted from the particlular tab!!"})
    } catch (error) {
        return res.status(500).json({message:"Error, something went wrong!"})
    }
}
exports.ModifyEmployee = async (req, res) => {
   let {id} = req.params;
   let {name, photo, role} = req.body;
   try {
    let emp = await operation.findOneAndUpdate({_id:id},
        {
            name:name,
            photo:photo,
            role:role
        }
    )
    await emp.save({});
    return res.status(200).json({message:"successfully updated user!!"})
   } catch (error) {
    return res.status(500).json({message:error.message})
   }
};


exports.Emplyoee = async(req,res)=>{
    let {category, qtr} = req.params;
    try{
        let emp = await operation.find({
            category:category,
            quater:qtr
        });
        return res.status(200).json(emp);
    }
    catch(err){
        return res.status(500).json({message:"something went wrong!!"})
    }
};
exports.manageTab = async(req,res)=>{
    let {category, qtr} = req.params;
    try{
        let emp = await operation.find({
            category:category,
            quater:qtr
        });
        return res.status(200).json(emp);
    }
    catch(err){
        return res.status(500).json({message:"something went wrong!!"})
    }
};

exports.AllEmployee = async(req,res)=>{
    // let {qtr} = req.params;
    try {
        let emp = await operation.find({});
        return res.status(200).json({emp})
    } catch (error) {
        return res.status(500).json({message:"something went wrong!"})
    }
}
exports.FindAnEmplyoee = async(req,res)=>{
    let {id} = req.params;
    try {
        let emp = await operation.findOne({_id:id});
        return res.status(200).json(emp)
    } catch (error) {
        return res.status(500).json({message:"something went wrong!"})
    }
}

exports.DeleteTab = async(req,res)=>{
    let {category, qtr} = req.params;
    try {
       let emp =  await operation.deleteMany({
        category:category,
        quater:qtr
    })
           .then((result)=>{
               return res.status(200).json({message:"successfully removed the whole " +category +" tab"})
        })
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}