import { seed_artists } from "./artist_seeder";
import { seed_genres } from "./genre_seeder";
import { seed_managers } from "./manager_seeder";
import { seed_settings } from "./settings_seeder";

async function seeder(){    
    await seed_settings()
    await seed_managers()
    await seed_genres()
    await seed_artists()
}

try {
    await seeder()
    console.log('All tables seeded successfully');
    
} catch (error) {
    console.log(error);
    process.exit(0)
}