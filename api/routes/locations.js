import express from 'express';
import fs from 'fs';

const locationrouter = express.Router();

const nigerianStates = JSON.parse(
  fs.readFileSync(new URL('../data/states.json', import.meta.url)),
);

locationrouter.get('/nigeria', (req, res) => {
  res.status(200).json(nigerianStates);
});

locationrouter.get('/search', (req, res) => {
  try {
    const q = (req.query.q || '').toLowerCase().trim();

    const results = [];

    if (!q) {
      return res.json([]);
    }

    for (const state of nigerianStates) {
      const stateMatch = state.state.toLowerCase().includes(q);

      if (stateMatch) {
        results.push({
          type: 'state',
          state: state.state,
        });
      }

      for (const lga of state.lgas || []) {
        const lgaMatch = lga.name.toLowerCase().includes(q);

        if (lgaMatch) {
          results.push({
            type: 'lga',
            state: state.state,
            lga: lga.name,
          });
        }

        for (const ward of lga.wards || []) {
          const wardMatch = ward.name.toLowerCase().includes(q);
          if (wardMatch) {
            results.push({
              type: 'ward',
              state: state.state,
              lga: lga.name,
              ward: ward.name,
            });
          }
        }
      }
    }

    res.json(results.slice(0, 30));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default locationrouter;
