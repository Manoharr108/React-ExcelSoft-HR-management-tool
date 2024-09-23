const operation = require("../models/emplyoee");

exports.AddEmplyoee =async(req, res)=>{
    try{
        let newemp = await operation.create(req.body);
        return res.status(201).json({message:"Successfully added to particular tab!!"});
    }
    catch(err){
        return res.status(500).json({message:err.message});
    }
}

exports.DeleteEmplyoee = async(req, res)=>{
    let {id} = req.params;
    try {
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
    let {category} = req.params;
    try{
        let emp = await operation.find({category:category});
        return res.status(200).json(emp);
    }
    catch(err){
        return res.status(500).json({message:"something went wrong!!"})
    }
};

exports.AllEmployee = async(req,res)=>{
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
    let {category} = req.params;
    try {
       let emp =  await operation.deleteMany({category:category})
           .then((result)=>{
               return res.status(200).json({message:"successfully removed the whole " +category +" tab"})
        })
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}