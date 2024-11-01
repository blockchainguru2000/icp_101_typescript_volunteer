import {
    bool,
    Canister,
    nat64,
    nat8,
    Opt,
    query,
    StableBTreeMap,
    text,
    Tuple,
    update,
    Vec,
    Record,
    Principal,
    Variant,
    Result,
    Err,
    ic,
    Ok
} from 'azle/experimental';

const Members = Record({
    name: text,
    location: text,
    specialist: text,
    registrationNumber: Principal,
});

// Register the group
const Group = Record({
    name: text,
    country: text,
    contactNumber: text,
    groupOfficialEmail: text,
    members: Vec(Members),
    services: text,
    createdAt: nat64,
    id: Principal,
});

// Defines types
type Group = typeof Group.tsType;
type Member = typeof Members.tsType;

// Define payloads
const groupPayload = Record({
    name: text,
    country: text,
    contactNumber: text,
    groupOfficialEmail: text,
    services: text,
});

const memberPayload = Record({
    name: text,
    location: text,
    specialist: text,
    nameOfGroup: text,
});

const searchPayload = Record({
    nameOfGroup: text,
});

const memberLeavePayload = Record({
    name: text,
    registrationNumber: Principal,
    groupName: text,
});

// Define errors
const errors = Variant({
    MissingCredentials: text,
    FailedToRegisterGroup: text,
    GroupAlreadyRegistered: text,
    GroupNotAvailable: text,
    ServicesNotAvailable: text,
    NotAMember: text,
});

const searchPayloadOnServices = Record({
    service: text,
});

const searchPayloadOnLocation = Record({
    location: text,
});

// Storage
const groupStorage = StableBTreeMap<text, Group>(0);
const servicesStorage = StableBTreeMap<text, Group>(1);
const groupBasedOnLocation = StableBTreeMap<text, Group>(2);

export default Canister({
    registerGroup: update([groupPayload], Result(text, errors), (payload) => {
        if (!payload.contactNumber || !payload.country || !payload.groupOfficialEmail || !payload.name || !payload.services) {
            return Err({ MissingCredentials: "Some credentials are missing" });
        }

        const existingGroup = groupStorage.get(payload.name);
        if (existingGroup) {
            return Err({ GroupAlreadyRegistered: "Group already exists" });
        }

        const newGroup: Group = {
            name: payload.name,
            country: payload.country,
            contactNumber: payload.contactNumber,
            groupOfficialEmail: payload.groupOfficialEmail,
            members: [],
            services: payload.services,
            createdAt: ic.time(),
            id: ic.caller(),
        };

        groupStorage.insert(payload.name, newGroup);
        servicesStorage.insert(payload.services, newGroup);
        groupBasedOnLocation.insert(payload.country, newGroup);

        return Ok("Group registered successfully");
    }),

    getAllGroups: query([], Vec(Group), () => {
        return groupStorage.values();
    }),

    getGroupByName: query([searchPayload], Result(Group, errors), (payload) => {
        if (!payload.nameOfGroup) {
            return Err({ MissingCredentials: "Group name is required" });
        }

        const group = groupStorage.get(payload.nameOfGroup);
        if (!group) {
            return Err({ GroupNotAvailable: `Group with name ${payload.nameOfGroup} is not available` });
        }

        return Ok(group);
    }),

    getGroupByService: query([searchPayloadOnServices], Result(Group, errors), (payload) => {
        if (!payload.service) {
            return Err({ MissingCredentials: "Service is required" });
        }

        const group = servicesStorage.get(payload.service);
        if (!group) {
            return Err({ GroupNotAvailable: `No group offers the service ${payload.service}` });
        }

        return Ok(group);
    }),

    volunteer: update([memberPayload], Result(text, errors), (payload) => {
        if (!payload.location || !payload.name || !payload.nameOfGroup || !payload.specialist) {
            return Err({ MissingCredentials: "Some credentials are missing" });
        }

        const group = groupStorage.get(payload.nameOfGroup);
        if (!group) {
            return Err({ GroupNotAvailable: `Group with name ${payload.nameOfGroup} is not available` });
        }

        const serviceGroup = servicesStorage.get(payload.specialist);
        if (!serviceGroup) {
            return Err({ ServicesNotAvailable: `Service ${payload.specialist} not offered by ${payload.nameOfGroup}` });
        }

        const newMember: Member = {
            name: payload.name,
            location: payload.location,
            specialist: payload.specialist,
            registrationNumber: ic.caller(),
        };

        const updatedGroup: Group = {
            ...group,
            members: [...group.members, newMember],
        };

        groupStorage.insert(payload.nameOfGroup, updatedGroup);
        servicesStorage.insert(payload.specialist, updatedGroup);
        groupBasedOnLocation.insert(group.country, updatedGroup);

        return Ok("Successfully volunteered");
    }),

    memberLeaveGroup: update([memberLeavePayload], Result(text, errors), (payload) => {
        if (!payload.groupName || !payload.name || !payload.registrationNumber) {
            return Err({ MissingCredentials: "Some credentials are missing" });
        }

        const group = groupStorage.get(payload.groupName);
        if (!group) {
            return Err({ GroupNotAvailable: `Group with name ${payload.groupName} is not available` });
        }

        const isMember = group.members.some((member) => member.name === payload.name && member.registrationNumber === payload.registrationNumber);
        if (!isMember) {
            return Err({ NotAMember: `You are not a member of ${payload.groupName}` });
        }

        const updatedGroup: Group = {
            ...group,
            members: group.members.filter((member) => member.name !== payload.name),
        };

        groupStorage.insert(payload.groupName, updatedGroup);
        servicesStorage.insert(group.services, updatedGroup);
        groupBasedOnLocation.insert(group.country, updatedGroup);

        return Ok("Exited group successfully");
    }),
});
