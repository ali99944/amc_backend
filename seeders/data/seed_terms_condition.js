import prisma from "../../lib/prisma.js";

async function seedTermsConditions() {
  const terms = await prisma.terms_conditions.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: 'Terms and Conditions',
      sections: {
        createMany: {
          data: [
            {
              title: '1. Acceptance of Terms',
              description: 'These terms govern your use of MusicApp services.',
              points: [
                '- By using MusicApp, you agree to these Terms of Service and our Privacy Policy.',
                '- If you do not agree, you may not use our services.',
              ],
            },
            {
              title: '2. Service Description',
              description: 'Overview of the services provided by MusicApp.',
              points: [
                '- MusicApp provides a streaming service that allows users to listen to music, create playlists, and discover new content.',
              ],
            },
            {
              title: '3. User Responsibilities',
              description: 'Expectations and rules for users of MusicApp.',
              points: [
                '- Use the service only for personal, non-commercial purposes',
                '- Not redistribute, copy, or modify any content',
                '- Not use the service for illegal activities',
              ],
            },
            {
              title: '4. Subscription Terms',
              description: 'Details about subscription plans and renewals.',
              points: [
                '- Premium subscriptions automatically renew unless canceled',
                '- Can be canceled anytime',
                '- Are non-refundable except as required by law',
              ],
            },
            {
              title: '5. Limitation of Liability',
              description: 'Limits on the liability of MusicApp for various issues.',
              points: [
                '- MusicApp is not liable for any indirect, incidental damages',
                '- Content accuracy or availability',
                '- Third-party actions',
              ],
            },
          ],
        },
      },
    },
  });
  console.log(`Seeded terms and conditions`);
}

export { seedTermsConditions }
