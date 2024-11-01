import {
    bool,
    Canister,
    nat64,
    text,
    Opt,
    query,
    StableBTreeMap,
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

const Member = Record({
    name: text,
    location: text,
    specialization: text,
    registrationNumber: Principal,
});

const Group = Record({
    name: text,
    country: text,
    contactNumber: text,
    groupOfficialEmail: text,
    members: Vec(Member),
    services: text,
    createdAt: nat64,
    id: Principal,
});

type Group = typeof Group.tsType;
type Member = typeof Member.tsType;

// Define payloads with standardized names
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
    specialization: text,
    groupName: text,
});

const searchPayload = Record({
    groupName: text,
});

const memberLeavePayload = Record({
    name: text,
    registrationNumber: Principal,
    groupName: text,
});

// Define error types with improved descriptions
const errors = Variant({
    MissingCredentials: text,
    FailedToRegisterGroup: text,
    GroupAlreadyRegistered: text,
    GroupNotAvailable: text,
    ServicesNotAvailable: text,
    NotAMember: text,
});

const serviceSearchPayload = Record({
    service: text,
});

const locationSearchPayload = Record({
    location: text,
});

// Storages
const groupStorage = StableBTreeMap<text, Group>(0);
const serviceStorage = StableBTreeMap<text, Group>(1);
const locationStorage = StableBTreeMap<text, Group>(2);

export default Canister({
    registerGroup: update([groupPayload], Result(text, errors), (payload) => {
        if (!payload.name || !payload.country || !payload.contactNumber || !payload.groupOfficialEmail || !payload.services) {
            return Err({
                MissingCredentials: "All fields are required: name, country, contactNumber, groupOfficialEmail, services",
            });
        }

        const existingGroup = groupStorage.get(payload.name);
        if (existingGroup) {
            return Err({
                GroupAlreadyRegistered: "A group with this name already exists",
            });
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
        serviceStorage.insert(payload.services, newGroup);
        locationStorage.insert(payload.country, newGroup);

        return Ok("Group registered successfully");
    }),

    getAllGroups: query([], Vec(Group), () => {
        return groupStorage.values();
    }),

    getGroup: query([searchPayload], Result(Group, errors), (payload) => {
        if (!payload.groupName) {
            return Err({
                MissingCredentials: "Group name is required",
            });
        }

        const group = groupStorage.get(payload.groupName);
        if (!group) {
            return Err({
                GroupNotAvailable: `Group with name ${payload.groupName} is not available`,
            });
        }

        return Ok(group);
    }),

    getGroupByService: query([serviceSearchPayload], Result(Group, errors), (payload) => {
        if (!payload.service) {
            return Err({
                MissingCredentials: "Service field is required",
            });
        }

        const group = serviceStorage.get(payload.service);
        if (!group) {
            return Err({
                GroupNotAvailable: `No group offers the service: ${payload.service}`,
            });
        }

        return Ok(group);
    }),

    volunteer: update([memberPayload], Result(text, errors), (payload) => {
        if (!payload.name || !payload.location || !payload.specialization || !payload.groupName) {
            return Err({
                MissingCredentials: "All fields are required: name, location, specialization, groupName",
            });
        }

        const group = groupStorage.get(payload.groupName);
        if (!group) {
            return Err({
                GroupNotAvailable: `Group with name ${payload.groupName} is not available`,
            });
        }

        if (group.services !== payload.specialization) {
            return Err({
                ServicesNotAvailable: `Service '${payload.specialization}' is not available in group '${payload.groupName}'`,
            });
        }

        const newMember: Member = {
            name: payload.name,
            location: payload.location,
            specialization: payload.specialization,
            registrationNumber: ic.caller(),
        };

        const updatedGroup: Group = {
            ...group,
            members: [...group.members, newMember],
        };

        groupStorage.insert(payload.groupName, updatedGroup);
        serviceStorage.insert(payload.specialization, updatedGroup);
        locationStorage.insert(group.country, updatedGroup);

        return Ok("Successfully volunteered");
    }),

    memberLeaveGroup: update([memberLeavePayload], Result(text, errors), (payload) => {
        if (!payload.groupName || !payload.name || !payload.registrationNumber) {
            return Err({
                MissingCredentials: "All fields are required: groupName, name, registrationNumber",
            });
        }

        const group = groupStorage.get(payload.groupName);
        if (!group) {
            return Err({
                GroupNotAvailable: `Group with name ${payload.groupName} is not available`,
            });
        }

        const isMember = group.members.some(member => member.name === payload.name && member.registrationNumber === payload.registrationNumber);
        if (!isMember) {
            return Err({
                NotAMember: `You are not a member of ${payload.groupName}`,
            });
        }

        const updatedGroup: Group = {
            ...group,
            members: group.members.filter(member => member.name !== payload.name),
        };

        groupStorage.insert(group.name, updatedGroup);
        serviceStorage.insert(group.services, updatedGroup);
        locationStorage.insert(group.country, updatedGroup);

        return Ok("Exited group successfully");
    }),
});
