import { Request, Response } from "express";
import serviceService from "../services/service.service";


class ServiceController {


    async create(req: Request, res: Response) {

        try {

            const service =
                await serviceService.create(req.body);

            return res.status(201).json(service);


        } catch (error:any) {

            return res.status(400).json({
                error: error.message
            });

        }

    }



    async findAll(req: Request, res: Response) {

        const services =
            await serviceService.findAll();

        return res.json(services);

    }



    async findById(req: Request, res: Response) {

        try {

            const id = Number(req.params.id);


            const service =
                await serviceService.findById(id);


            return res.json(service);


        } catch(error:any){

            return res.status(404).json({
                error:error.message
            });

        }

    }




    async update(req: Request, res: Response) {

        try {

            const id = Number(req.params.id);


            const service =
                await serviceService.update(
                    id,
                    req.body
                );


            return res.json(service);


        } catch(error:any){

            return res.status(400).json({
                error:error.message
            });

        }

    }





    async delete(req: Request, res: Response) {

        try {

            const id = Number(req.params.id);


            await serviceService.delete(id);


            return res.status(204).send();


        } catch(error:any){

            return res.status(404).json({
                error:error.message
            });

        }

    }

}


export default new ServiceController();