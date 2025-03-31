import WorkerSkill from "../models/skill.model.js"

export const getSkillList  = async(req,res,next)=>{
    try {
        const skillList = await WorkerSkill.find({});
        // console.log("SkillLIst: ",WorkerSkill.collection)
        if (!skillList || skillList.length === 0) {
             res.status(404)
             throw new Error ('No data found' );
          }
         res.status(200).json({message:"worker skill fetched successfully",data:skillList})
    } catch (error) {
        next(error)
    }
}