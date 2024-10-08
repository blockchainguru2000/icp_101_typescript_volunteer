import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface _SERVICE {
  'get_a_group' : ActorMethod<
    [{ 'nameofgroup' : string }],
    {
        'Ok' : {
          'id' : Principal,
          'members' : Array<
            {
              'regestrationNumber' : Principal,
              'name' : string,
              'specialist' : string,
              'location' : string,
            }
          >,
          'country' : string,
          'name' : string,
          'created_at' : bigint,
          'contactnumber' : string,
          'groupoficialemail' : string,
          'services' : string,
        }
      } |
      {
        'Err' : { 'GroupNotAvailble' : string } |
          { 'GroupAlreadyRegistered' : string } |
          { 'MissingCredentials' : string } |
          { 'ServicesNotAvailable' : string } |
          { 'NotAMember' : string } |
          { 'FailedToRegisterGroup' : string }
      }
  >,
  'get_a_group_on_Services_offering' : ActorMethod<
    [{ 'service' : string }],
    {
        'Ok' : {
          'id' : Principal,
          'members' : Array<
            {
              'regestrationNumber' : Principal,
              'name' : string,
              'specialist' : string,
              'location' : string,
            }
          >,
          'country' : string,
          'name' : string,
          'created_at' : bigint,
          'contactnumber' : string,
          'groupoficialemail' : string,
          'services' : string,
        }
      } |
      {
        'Err' : { 'GroupNotAvailble' : string } |
          { 'GroupAlreadyRegistered' : string } |
          { 'MissingCredentials' : string } |
          { 'ServicesNotAvailable' : string } |
          { 'NotAMember' : string } |
          { 'FailedToRegisterGroup' : string }
      }
  >,
  'getallgroups' : ActorMethod<
    [],
    Array<
      {
        'id' : Principal,
        'members' : Array<
          {
            'regestrationNumber' : Principal,
            'name' : string,
            'specialist' : string,
            'location' : string,
          }
        >,
        'country' : string,
        'name' : string,
        'created_at' : bigint,
        'contactnumber' : string,
        'groupoficialemail' : string,
        'services' : string,
      }
    >
  >,
  'member_leave_group' : ActorMethod<
    [
      {
        'regestrationNumber' : Principal,
        'name' : string,
        'groupname' : string,
      },
    ],
    { 'Ok' : string } |
      {
        'Err' : { 'GroupNotAvailble' : string } |
          { 'GroupAlreadyRegistered' : string } |
          { 'MissingCredentials' : string } |
          { 'ServicesNotAvailable' : string } |
          { 'NotAMember' : string } |
          { 'FailedToRegisterGroup' : string }
      }
  >,
  'registerGroup' : ActorMethod<
    [
      {
        'country' : string,
        'name' : string,
        'contactnumber' : string,
        'groupoficialemail' : string,
        'services' : string,
      },
    ],
    { 'Ok' : string } |
      {
        'Err' : { 'GroupNotAvailble' : string } |
          { 'GroupAlreadyRegistered' : string } |
          { 'MissingCredentials' : string } |
          { 'ServicesNotAvailable' : string } |
          { 'NotAMember' : string } |
          { 'FailedToRegisterGroup' : string }
      }
  >,
  'volunteer' : ActorMethod<
    [
      {
        'nameofgroup' : string,
        'name' : string,
        'specialist' : string,
        'location' : string,
      },
    ],
    { 'Ok' : string } |
      {
        'Err' : { 'GroupNotAvailble' : string } |
          { 'GroupAlreadyRegistered' : string } |
          { 'MissingCredentials' : string } |
          { 'ServicesNotAvailable' : string } |
          { 'NotAMember' : string } |
          { 'FailedToRegisterGroup' : string }
      }
  >,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
