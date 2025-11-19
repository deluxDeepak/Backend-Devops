const searchController=(req,res,next)=>{
    res.status(200).json({
        success:true,
        message:"Fake Searching performed !"
    })

}

module.exports={
    searchController
}