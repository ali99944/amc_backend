import asyncWrapper from "../lib/wrappers/async_wrapper.js";

export const getAllAudioVersionsController = asyncWrapper(
    async () => {

    } 
)

export const createAudioVersionController = asyncWrapper(
    async () => {
        
    }
)

export const deleteAudioVersionController = asyncWrapper(
    async (req, res) => {
        const { id } = req.params
    }
)