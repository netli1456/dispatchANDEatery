import { Soup } from '../models/soup.js';

const soupData = {

name:
"Egusi soup",
price:
4000,
img:"https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=300&q=80",
};

export const createSoup = async (req, res) => {
  try {
    const id = '685022697bdc355ba3b7a63c';
    const soup = new Soup({
      name: soupData.name,
      price: soupData.price,
      userId: id,
      img: soupData.img,
    });
    await soup.save();
    res.status(200).json({ soup });
    console.log(soup);
  } catch (error) {
    res.status(500).json(error);
  }
};
