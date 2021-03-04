import Reservation from '../models/Reservation';
import House from '../models/House';

class ReservationController {
    async index(req, res) {
        const { user_id } = req.headers;

        const reservations = await Reservation.find({ user: user_id }).populate(
            'house'
        );

        return res.json({ reservations });
    }

    async store(req, res) {
        const { user_id } = req.headers;
        const { house_id } = req.params;
        const { date } = req.body;

        const house = await House.findById(house_id);

        if (!house) {
            return res.status(400).json({ error: 'House not found' });
        }

        if (!house.status) {
            return res.status(400).json({ error: 'House is unavailable' });
        }

        if (String(user_id) === String(house.user)) {
            return res.status(401).json({ error: 'unauthorized reservation' });
        }

        const reservation = await Reservation.create({
            user: user_id,
            house: house_id,
            date,
        });

        await reservation.populate('house').populate('user').execPopulate();

        return res.json(reservation);
    }

    async destroy(req, res) {
        const { user_id } = req.headers;
        const { reservation_id } = req.body;

        await Reservation.findByIdAndDelete({ _id: reservation_id });

        return res.send();
    }
}

export default new ReservationController();
