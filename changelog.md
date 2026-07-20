# Changelog

This changelog is in broad terms and might miss a few changes here and there

V0.1:

- bot deletes all of its own previous messages on restart to avoid clutter
- added initial welcome/role message
- added commands: "status", "info" and "help"
- added server log messages

V0.2:

- bot can now give roles to users

V0.3:

- users can now remove roles by clicking the emoji again

V0.4:

- bot now only reacts to reactions on messages in roles channel
- bot now only sends welcome message if no welcome message exists

V0.5:

- moved source into src/ and compile output into dist/
- guilds, roles, and role messages are now loaded from JSON config (dev/prod) instead of being hardcoded
- bot can set up roles for multiple guilds from config
- role message is built from config and edited if it no longer matches
- added simple log helpers (info / warn / error)

V0.2.1:

- Changed versioning to use semantic versioning instead of V0.X
- Security updates

V0.2.2:

- Moved commands to src/commands.ts
- Added versioning git action
