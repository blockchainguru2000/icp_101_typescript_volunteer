export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'get_a_group' : IDL.Func(
        [IDL.Record({ 'nameofgroup' : IDL.Text })],
        [
          IDL.Variant({
            'Ok' : IDL.Record({
              'id' : IDL.Principal,
              'members' : IDL.Vec(
                IDL.Record({
                  'regestrationNumber' : IDL.Principal,
                  'name' : IDL.Text,
                  'specialist' : IDL.Text,
                  'location' : IDL.Text,
                })
              ),
              'country' : IDL.Text,
              'name' : IDL.Text,
              'created_at' : IDL.Nat64,
              'contactnumber' : IDL.Text,
              'groupoficialemail' : IDL.Text,
              'services' : IDL.Text,
            }),
            'Err' : IDL.Variant({
              'GroupNotAvailble' : IDL.Text,
              'GroupAlreadyRegistered' : IDL.Text,
              'MissingCredentials' : IDL.Text,
              'ServicesNotAvailable' : IDL.Text,
              'NotAMember' : IDL.Text,
              'FailedToRegisterGroup' : IDL.Text,
            }),
          }),
        ],
        ['query'],
      ),
    'get_a_group_on_Services_offering' : IDL.Func(
        [IDL.Record({ 'service' : IDL.Text })],
        [
          IDL.Variant({
            'Ok' : IDL.Record({
              'id' : IDL.Principal,
              'members' : IDL.Vec(
                IDL.Record({
                  'regestrationNumber' : IDL.Principal,
                  'name' : IDL.Text,
                  'specialist' : IDL.Text,
                  'location' : IDL.Text,
                })
              ),
              'country' : IDL.Text,
              'name' : IDL.Text,
              'created_at' : IDL.Nat64,
              'contactnumber' : IDL.Text,
              'groupoficialemail' : IDL.Text,
              'services' : IDL.Text,
            }),
            'Err' : IDL.Variant({
              'GroupNotAvailble' : IDL.Text,
              'GroupAlreadyRegistered' : IDL.Text,
              'MissingCredentials' : IDL.Text,
              'ServicesNotAvailable' : IDL.Text,
              'NotAMember' : IDL.Text,
              'FailedToRegisterGroup' : IDL.Text,
            }),
          }),
        ],
        ['query'],
      ),
    'getallgroups' : IDL.Func(
        [],
        [
          IDL.Vec(
            IDL.Record({
              'id' : IDL.Principal,
              'members' : IDL.Vec(
                IDL.Record({
                  'regestrationNumber' : IDL.Principal,
                  'name' : IDL.Text,
                  'specialist' : IDL.Text,
                  'location' : IDL.Text,
                })
              ),
              'country' : IDL.Text,
              'name' : IDL.Text,
              'created_at' : IDL.Nat64,
              'contactnumber' : IDL.Text,
              'groupoficialemail' : IDL.Text,
              'services' : IDL.Text,
            })
          ),
        ],
        ['query'],
      ),
    'member_leave_group' : IDL.Func(
        [
          IDL.Record({
            'regestrationNumber' : IDL.Principal,
            'name' : IDL.Text,
            'groupname' : IDL.Text,
          }),
        ],
        [
          IDL.Variant({
            'Ok' : IDL.Text,
            'Err' : IDL.Variant({
              'GroupNotAvailble' : IDL.Text,
              'GroupAlreadyRegistered' : IDL.Text,
              'MissingCredentials' : IDL.Text,
              'ServicesNotAvailable' : IDL.Text,
              'NotAMember' : IDL.Text,
              'FailedToRegisterGroup' : IDL.Text,
            }),
          }),
        ],
        [],
      ),
    'registerGroup' : IDL.Func(
        [
          IDL.Record({
            'country' : IDL.Text,
            'name' : IDL.Text,
            'contactnumber' : IDL.Text,
            'groupoficialemail' : IDL.Text,
            'services' : IDL.Text,
          }),
        ],
        [
          IDL.Variant({
            'Ok' : IDL.Text,
            'Err' : IDL.Variant({
              'GroupNotAvailble' : IDL.Text,
              'GroupAlreadyRegistered' : IDL.Text,
              'MissingCredentials' : IDL.Text,
              'ServicesNotAvailable' : IDL.Text,
              'NotAMember' : IDL.Text,
              'FailedToRegisterGroup' : IDL.Text,
            }),
          }),
        ],
        [],
      ),
    'volunteer' : IDL.Func(
        [
          IDL.Record({
            'nameofgroup' : IDL.Text,
            'name' : IDL.Text,
            'specialist' : IDL.Text,
            'location' : IDL.Text,
          }),
        ],
        [
          IDL.Variant({
            'Ok' : IDL.Text,
            'Err' : IDL.Variant({
              'GroupNotAvailble' : IDL.Text,
              'GroupAlreadyRegistered' : IDL.Text,
              'MissingCredentials' : IDL.Text,
              'ServicesNotAvailable' : IDL.Text,
              'NotAMember' : IDL.Text,
              'FailedToRegisterGroup' : IDL.Text,
            }),
          }),
        ],
        ['query'],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
