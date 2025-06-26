import { useState } from 'react';
import { Button, ListGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';

function Extra({ type, cat, extras, setExtras }) {
  const [extraItem, setextraItem] = useState('');
  const [price, setPrice] = useState('');
  const [limit, setLimit] = useState('');
  console.log('extras', extras);

  const extraData = [
    {
      category: 'Swallow',
      items: ['semo', 'eba', 'wheat', 'amala', 'fufu', 'pounded yam'],
    },
    {
      category: 'Rice',
      items: [
        'extra rice',
        'extra meat',
        'moi moi',
        'fried plantain',
        'boiled egg',
      ],
    },
    {
      category: 'Pasta',
      items: [
        'extra spaghetti',
        'meatballs',
        'sauce',
        'boiled egg',
        'plantain',
      ],
    },
    {
      category: 'Snacks',
      items: ['extra meat pie', 'sauce', 'ketchup', 'egg', 'cheese'],
    },
    {
      category: 'Desert',
      items: ['ice cream scoop', 'whipped cream', 'chocolate syrup', 'fruits'],
    },
    {
      category: 'Ice cream',
      items: ['extra scoop', 'wafer cone', 'sprinkles', 'toppings', 'syrup'],
    },
    {
      category: 'Meat',
      items: ['extra beef', 'chicken lap', 'turkey', 'ponmo', 'assorted'],
    },
    {
      category: 'Steaks',
      items: ['pepper sauce', 'mash potatoes', 'gravy', 'veggies'],
    },
    {
      category: 'Burger',
      items: ['cheese', 'bacon', 'egg', 'extra patty', 'ketchup'],
    },
    {
      category: 'Pizza',
      items: [
        'extra cheese',
        'pepperoni',
        'sausage',
        'chicken topping',
        'onions',
      ],
    },
    {
      category: 'Shawarma',
      items: ['extra sausage', 'egg', 'extra meat', 'cheese'],
    },
    {
      category: 'Water',
      items: ['ice', 'cup', 'straw'],
    },
    {
      category: 'Coke',
      items: ['ice cubes', 'lemon slice', 'cup', 'straw'],
    },
    {
      category: 'Fanta',
      items: ['ice cubes', 'orange slice', 'cup', 'straw'],
    },
    {
      category: 'Zobo',
      items: ['ice', 'pineapple slice', 'ginger shot', 'cup'],
    },
    {
      category: 'Juice',
      items: ['ice', 'mint leaf', 'lemon wedge', 'straw'],
    },
    {
      category: 'Smoothie',
      items: ['whipped cream', 'granola', 'chia seeds', 'honey drizzle'],
    },
    {
      category: 'Table Water',
      items: ['cold', 'room temp', 'bottle', 'cup'],
    },
    {
      category: 'Bottle Water',
      items: ['small size', 'medium size', 'large size'],
    },
    {
      category: 'Sachet Water',
      items: ['frozen', 'unfrozen', 'clean sachet'],
    },
    {
      category: 'Vanilla',
      items: ['extra scoop', 'sprinkles', 'wafer', 'caramel'],
    },
    {
      category: 'Chocolate',
      items: ['extra scoop', 'choco chips', 'fudge', 'brownie chunk'],
    },
    {
      category: 'Strawberry',
      items: ['extra scoop', 'strawberry bits', 'cream topping', 'jam swirl'],
    },
    {
      category: 'Mixed Flavour',
      items: ['wafer cone', 'sprinkles', 'toppings', 'cherry'],
    },
  ];

  const handleExtras = () => {
    if (extraItem && price && limit) {
      const existingItem = extras?.find(
        (i) => i.item === `${extraItem} ${type} - ${cat} `
      );
      if (!existingItem) {
        setExtras((prev) => [
          ...prev,
          {
            item: `${extraItem} ${type} - ${cat} `,
            price: parseFloat(price),
            limit: parseFloat(limit),
          },
        ]);
        setextraItem('');
        setPrice('');
        setLimit('');
      } else {
        toast.error(`Can not add ${extraItem} twice`, {
          toastId: 'unique-toast-id',
        });
      }
    }
  };

  const removeExtrasItem = (index) => {
    setExtras((prev) => prev.filter((_, item) => item !== index));
  };

  return (
    <div className="my-4">
      <div
        style={{
          backgroundColor: '#d3d3d3',
          color: '#000',
        }}
        className="bg-inf p-3"
      >
        <div className="text-center mb-3 border-bottom border-dark">
          <strong>Fill here if you sell extra</strong>
        </div>
        <div className="d-flex flex-column gap-2">
          <div className="d-flex gap-2">
            <label>Extra:</label>
            <select
              value={extraItem}
              onChange={(e) => setextraItem(e.target.value)}
            >
              {extraItem === '' && <option value="">Select category</option>}
              {extraData
                .find((item) => type === item.category)
                ?.items.map((i, index) => (
                  <option
                    className=" iconHover"
                    style={{ cursor: 'pointer' }}
                    key={index}
                    value={i}
                  >
                    {i}
                  </option>
                ))}
            </select>
          </div>
          <div className="d-flex gap-2">
            <label>1 Portion Price:</label>
            <input
              disabled={extraItem === ''}
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 1500"
            />
          </div>
          <div className="d-flex gap-2">
            <label>Limit Per Person:</label>
            <input
              disabled={extraItem === ''}
              type="number"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              placeholder="e.g. 10 portion only"
            />
          </div>

          <Button
            disabled={!extraItem && !price && !limit}
            onClick={() => handleExtras()}
            variant="light"
          >
            Save
          </Button>
          <div className="mt-4">
            {extras?.length > 0 && (
              <ListGroup>
                <span className="text-center fw-bold mb-2">Extras</span>
                {extras?.map((list, i) => (
                  <ListGroup.Item key={i}>
                    Added extra {list?.item}, N{list.price}, limit of{' '}
                    {list.limit}
                    <Button
                      variant="danger"
                      className="rounded-pill mx-3 py-0"
                      onClick={() => removeExtrasItem(i)}
                    >
                      Remove
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Extra;
