const dataValidation=(req,res,next)=>{
    const{r, m, mtm, ltm, mtf, ltf, c, apiKey}=req.query

    //console.log(r)
    if(r && typeof r!=="string"){
        return next(res.status(400).json({msg:"Range must be a string"}))
    }
    if(m && typeof m!=="string"){
        return next(res.status(400).json({msg:"Mountain must be a string"}))
    }
    if(mtm && typeof mtm!=="string"){
        return next(res.status(400).json({msg:"More than meters... must be a number"}))
    }
    if(ltm && typeof ltm!=="string"){
        return next(res.status(400).json({msg:"Less than meters... be a number"}))
    }
    if(mtf && typeof mtf!=="string"){
        return next(res.status(400).json({msg:"More than feet... must be a number"}))
    }
    if(ltf && typeof ltf!=="string"){
        return next(res.status(400).json({msg:"Less than feet must be a number"}))
    }
    if(c && typeof c!=="string"){
        return next(res.status(400).json({msg:"Country must be a string"}))
    }
     if(apiKey && typeof apiKey!=="string"){
        return next(res.status(400).json({msg:"apiKey must be a string"}))
     }
    next()
}

module.exports=dataValidation