# The Lab (Idea Board)

Personal idea management app with AI scoring via Claude API. Browse, submit, and evaluate business ideas.

## Repository

- **GitHub:** corporate-enthusiasts/ideas
- **Account:** corporate-enthusiasts org (push via default git auth)
- **Deploy:** Vercel (auto-deploy on push to main)
- **Live URL:** https://idea-board-wheat.vercel.app

## Tech Stack

- **Framework:** Next.js + TypeScript
- **Database:** GitHub as database (via API)
- **AI:** Claude API for idea scoring
- **Auth:** Required for writes, guest browsing for reads

## Notes

- This repo is under the `corporate-enthusiasts` org, not `tiobenito`
- Guest browsing mode enabled — GET requests pass without auth
- Write actions (POST/PUT/DELETE) require authentication
