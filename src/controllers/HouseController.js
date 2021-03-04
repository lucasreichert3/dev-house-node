import * as Yup from 'yup';
import House from '../models/House';
import User from '../models/User';

class HouseController {
    async index(req, res) {
        const { status } = req.query;
        const houses = await House.find({ status });

        return res.json({ houses });
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            description: Yup.string().required(),
            price: Yup.number().required(),
            location: Yup.string().required(),
            status: Yup.boolean().required(),
        });
        const { filename } = req.file;
        const { description, price, location, status } = req.body;
        const { user_id } = req.headers;

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation failed' });
        }

        const house = await House.create({
            user: user_id,
            thumbnail: filename,
            description,
            price,
            location,
            status,
        });

        return res.json(house);
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            description: Yup.string().required(),
            price: Yup.number().required(),
            location: Yup.string().required(),
            status: Yup.boolean().required(),
        });

        const { filename } = req.file;
        const { id } = req.params;
        const { description, price, location, status } = req.body;
        const { user_id } = req.headers;

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation failed' });
        }

        const user = await User.findById(user_id);
        const house = await House.findById(id);

        if (String(user._id) !== String(house.user)) {
            return res.status(401).json({ error: 'Not authorized' });
        }

        await House.updateOne(
            { _id: id },
            {
                user: user_id,
                thumbnail: filename,
                description,
                price,
                location,
                status,
            }
        );

        return res.send();
    }

    async destroy(req, res) {
        const { house_id } = req.body;
        const { user_id } = req.headers;

        const user = await User.findById(user_id);
        const house = await House.findById(house_id);

        if (String(user._id) !== String(house.user)) {
            return res.status(401).json({ error: 'Not authorized' });
        }

        await House.findByIdAndDelete({ _id: house_id });

        return res.json({ message: 'House deleted!' });
    }
}

export default new HouseController();
