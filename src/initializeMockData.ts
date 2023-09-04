import { pool, queryDB } from './db';

async function insertSampleData() {
  try {
    await queryDB('SET foreign_key_checks = 0');
    await queryDB('DELETE FROM Page');
    await queryDB('SET foreign_key_checks = 1');
    await queryDB('ALTER TABLE Page AUTO_INCREMENT = 1');
    const mockData = [
      { title: 'Home', content: 'This is the home page', parent_id: null },
      { title: 'About', content: 'About us page', parent_id: 1 },
      { title: 'Our History', content: 'Our company history', parent_id: 2 },
      { title: 'Milestones', content: 'Important milestones of our company', parent_id: 3 },
      { title: 'Contact', content: 'Contact us page', parent_id: 1 },
      { title: 'Head Office', content: 'Details about our head office', parent_id: 5 },
      { title: 'Branches', content: 'Details about our branches', parent_id: 5 },
      { title: 'Services', content: 'Our services', parent_id: null },
      { title: 'Web Development', content: 'We provide web development services', parent_id: 8 },
      { title: 'Backend Development', content: 'Backend development details', parent_id: 9 },
      { title: 'Frontend Development', content: 'Frontend development details', parent_id: 9 },
      { title: 'Mobile Development', content: 'We provide mobile app development services', parent_id: 8 },
      { title: 'iOS Development', content: 'iOS app development details', parent_id: 12 },
      { title: 'Android Development', content: 'Android app development details', parent_id: 12 },
    ];

    for (let data of mockData) {
      await queryDB('INSERT INTO Page (title, content, parent_id) VALUES (?, ?, ?)', [data.title, data.content, data.parent_id]);
    }

    console.log('Mock data inserted successfully.');
  } catch (error) {
    console.error('Error inserting mock data:', error);
  } finally {
    // Close the database connection
    pool.end();
  }
}

insertSampleData();
