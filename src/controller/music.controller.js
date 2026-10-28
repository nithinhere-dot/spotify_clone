const musicModel = require("../models/music.model");
const albumModel = require("../models/album.model")
const jwt = require("jsonwebtoken")
const {uploadFile}= require("../services/storage.service")


async function createMusic(req,res){
    const token= req.cookies.token;

    const {title}= req.body
    const file = req.file

    const result = await uploadFile(file.buffer.toString('base64'))

    const music = await musicModel.create({
        url:result.url,
        title,
        artist:req.user.id,
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
}

async function createAlbum(req,res){
    const token = req.cookies.token;

    const {title,musicIds} = req.body;
    const album = await albumModel.create({
            title,
            artist:req.user.id,
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
}

async function getAllMusics(req,res) {
    const Musics = await musicModel.find()

    res.status(200).json({
        message:"Musics fethced successfully",
        musics:Musics,
    })
    
}

async function getAllAlbum(req,res){
    const albums = await albumModel.find().populate("artist","username email").populate("musics")

    res.status(200).json({
        message:"Album fetched successfully",
        albums:albums,
    })
}

module.exports = {createMusic,createAlbum,getAllMusics,getAllAlbum}