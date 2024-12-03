# Checklist

## Priority

### Role message

- [ ] Implement role message portion of startup
  - [ ] Update the role message of each guild
  - [ ] Add reactions if any are missing
  - [ ] Remove reactions if a role is no longer available
- [ ] Update role member counter on changes role given or removed
- [ ] Update the role message on events like new role added or removed, someone leaves the server or gets banned, ...

### Roles

- [x] Implement toggleRole function
- [x] Implement timer to allow roles to be given in batches
- [ ] Remove a role if it is no longer available on the server

### Cache

- [x] Implement `updateJsonCache()` function
- [ ] Implement `updateDiscordCache()` function

### Logging

- [ ] Setup automatic emails on major errors

### Structure

- [x] Move discord events to events folder
- [x] Move discord slash commands to commands folder

### Prepare server setup

- [x] Uncomment test directory from .gitignore
- [ ] Setup npm start script(s)
- [ ] Switch to Production database

## Optional / secondary

### Optimization

- [ ] Optimize detection of role message on startup
- [ ] Make sure the cache of the client is used instead of fetch where possible

### Documentation

- [ ] Document functions
- [ ] Document interfaces

### Aesthetic

- [ ] Fix emoji alignment problem on windows desktop (Not really a dramatic problem, but would look a little nicer)
