import { db } from "../libs/db.js"

export const createPlaylist = async (req, res) => {
    try {
        const { name, description } = req.body

        if (!name) {
            return res.status(500).json({
                error: "Name field is required"
            })
        }

        const userId = req.user.id

        const playlistExist = await db.playlist.findUnique({
            where: { name_userId: { name, userId } }
        })

        if (playlistExist) {
            return res.status(500).json({
                error: "Playlist with this name already exist"
            })
        }

        const newPlaylist = await db.playlist.create({
            data: {
                name, description, userId
            }
        })

        res.status(201).json({
            success: true,
            message: "Playlist created successfully",
            data: newPlaylist
        })

    } catch (error) {
        console.log(error, "Error while creating a new playlist")
        return res.status(500).json({
            error: "Error while creating a new playlist"
        })
    }
}


export const getAllListDetails = async (req, res) => {
    try {

        const userId = req.user.id

        const playlists = await db.playlist.findMany({
            where: {
                userId
            }, include: {
                problems: {
                    include: {
                        problem: true
                    }
                }
            }
        })

        res.status(200).json({
            success: true,
            message: "Playlist fetched successfully",
            data: playlists
        })
    } catch (error) {
        console.log(error, "Error while getting details of  all playlist")
        return res.status(500).json({
            error: "Error while getting details of  all playlist"
        })
    }
}


export const getPlaylistDetails = async (req, res) => {
    try {

        const userId = req.user.id

        const playlistId = req.params.playlistId

        const playlist = await db.playlist.findUnique({
            where: {
                id: playlistId,
            }, include: {
                problems: {
                    include: {
                        problem: true
                    }

                }
            }
        })

        if (!playlist) {
            return res.status(404).json({
                error: "Playlist not found "
            })
        }

        res.status(200).json({
            success: true,
            message: "Playlist data fetched successfully",
            data: playlist
        })

    } catch (error) {
        console.log(error, "Error while getting details of   playlist")
        return res.status(500).json({
            error: "Error while getting details of  playlist"
        })
    }
}


export const addProblemToPlaylist = async (req, res) => {
    try {

        const { playlistId } = req.params

        const { problemIds } = req.body

        if (!Array.isArray(problemIds) || problemIds.length < 1) {
            return res.status(400).json({
                error: "Invalid or missing problemsId"
            })
        }

        const problemsInPlaylist = await db.problemInPlaylist.createMany({
            data: problemIds.map(problemId => ({ problemId, playlistId }))
        })

        res.status(201).json({
            success: true,
            message: "Problems added to playlist successfully",
            data: problemsInPlaylist
        })

    } catch (error) {
        console.log(error, "Error while adding problem  to playlist")
        return res.status(500).json({
            error: "Error while adding problem  to playlist"
        })
    }
}


export const deletePlaylist = async (req, res) => {
    try {

        const { playlistId } = req.params

        const playlist = await db.playlist.findUnique({
            where: {
                id: playlistId
            }
        })

        if (!playlist) {
            return res.status(500).json({
                error: "Please provide a valid problem id"
            })
        }

        await db.playlist.delete({
            where: {
                id: playlistId
            }
        })

        res.status(200).json({
            success: true,
            message: "Playlist removed successfully"
        })

    } catch (error) {
        console.log(error, "Error while deleting a playlist")
        return res.status(500).json({
            error: "Error while deleting a playlist"
        })
    }
}


export const removeProblemFromPlaylist = async (req, res) => {
    try {
        const { playlistId } = req.params

        const { problemIds } = req.body

        if (!Array.isArray(problemIds) || problemIds.length < 1) {
            return res.status(400).json({
                error: "Invalid or missing problemsId"
            })
        }

        await db.problemInPlaylist.deleteMany({
            where: {
                playlistId,
                problemId: {
                    in: problemIds
                }
            }
        })

        res.status(200).json({
            success: true,
            message: "Problems remove successfully"
        })

    } catch (error) {
        console.log(error, "Error while deleting a problem from playlist")
        return res.status(500).json({
            error: "Error while deleting a problem from playlist"
        })
    }
}