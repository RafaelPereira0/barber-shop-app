import { Request, Response } from "express";
import serviceService from "../services/service.service";
import { createServiceSchema } from "../validations/service.validation";


class ServiceController {


    async create(req: Request, res: Response) {

        try {
            const data = createServiceSchema.parse(req.body)
            const service =
                await serviceService.create(data);

            return res.status(201).json(service);


        } catch (error: any) {

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


        } catch (error: any) {

            return res.status(404).json({
                error: error.message
            });

        }

    }




    async update(req: Request, res: Response) {

        try {

            const id = Number(req.params.id);
            const user = req.user;

            if (!user) {
                return res.status(401).json({
                    message: "Usuário não autenticado"
                });
            }

            const service =
                await serviceService.update(
                    id,
                    req.body,
                    user.role
                );


            return res.json(service);


        } catch (error: any) {

            return res.status(400).json({
                error: error.message
            });

        }

    }





    async delete(req: Request, res: Response) {

        try {

            const id = Number(req.params.id);

            const user = req.user;

            if (!user) {
                return res.status(401).json({
                    message: "Usuário não autenticado"
                });
            }

            const deleted = await serviceService.delete(id, user.role);


            return res.status(204).json({ result: deleted, message: "Serviço deletado com sucesso!" });


        } catch (error: any) {

            return res.status(404).json({
                error: error.message
            });

        }

    }

}


export default new ServiceController();