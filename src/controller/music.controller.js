const musicModel = require("../models/music.model");
const albumModel = require("../models/album.model")
const jwt = require("jsonwebtoken")
const {uploadFile}= require("../services/storage.service")


async function createMusic(req,res){
    const token= req.cookies.token;

    if(!token){
        return res.status(401).json({message:"Unauthorized"})
    }
    try{

        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        if(decoded.role!=="artist"){
            return res.status(403).json({message:"You don't have access to create an music"})
        }

    
    const {title}= req.body
    const file = req.file

    const result = await uploadFile(file.buffer.toString('base64'))

    const music = await musicModel.create({
        url:result.url,
        title,
        artist:decoded.id,
    })

    res.status(201).json({
        message:"Music created successfully",
        music:{
            id:music._id,
            url:music.url,
            title:music.title,
            artist:music.artist,
        }
    })
    }catch(err){
        return res.status(401).json({message:"Unauthroized"})
    }



}

async function createAlbum(req,res){
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({message:"unauthorized"})
    }

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        if(decoded.role !=="artist"){
            return res.status(403).json({message:"You dont have access to create a album"})
        }

        const {title,musicIds} = req.body;
        const album = await albumModel.create({
            title,
            artist:decoded.id,
            musics:musicIds,
        })
        res.status(201).json({
            message:"Album created successfully",
            album:{
                id:album._id,
                title:album.title,
                artist:album.artist,
                musics:album.musics,
            }
            })
    }catch(err){
        console.log(err);
        return res.status(401).json({message:"Unauthrized"})
    }
}
module.exports = {createMusic}