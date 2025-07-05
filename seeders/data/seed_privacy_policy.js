import prisma from "../../lib/prisma.js";

async function seedPrivacyPolicy() {
  const policy = await prisma.privacy_policy.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: 'Privacy Policy',
      sections: {
        createMany: {
          data: [
            {
              title: '1. Information We Collect',
              description: 'This Privacy Policy describes the information we collect from you, how we use it, and how you can control the use of your information.',
              points: [
                '- Account information (email, name, profile picture)',
                '- Usage data (songs played, playlists created)',
                '- Device information (model, operating system)',
                '- Location data (if you enable this feature)',
              ],
            },
            {
              title: '2. How We Use Information',
              description: 'We use the information we collect from you to provide and improve our services, personalize your experience, communicate with you, and ensure security and prevent fraud.',
              points: [
                '- Provide and improve our services',
                '- Personalize your experience',
                '- Communicate with you about updates',
                '- Ensure security and prevent fraud',
              ],
            },
            {
              title: '3. Sharing Your Information',
              description: 'We may share your information with service providers, law enforcement, and other users under certain circumstances.',
              points: [
                '- Service providers who assist our operations',
                '- Law enforcement when required',
                '- Other users (only what you choose to share)',
              ],
            },
            {
              title: '4. Your Choices',
              description: 'You have choices about how your information is used and shared.',
              points: [
                '- Access and update your information in settings',
                '- Opt-out of marketing communications',
                '- Delete your account at any time',
              ],
            },
          ],
        },
      },
    },
  });
  console.log(`Seeded privacy policy`);
}

export { seedPrivacyPolicy }

