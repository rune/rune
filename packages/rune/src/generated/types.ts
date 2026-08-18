import { FieldPolicy, FieldReadFunction, TypePolicies, TypePolicy } from '@apollo/client/cache';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Upload: { content: Buffer, name: string, type: string };
}

export interface CheckVerificationInput {
  clientMutationId?: InputMaybe<Scalars['String']>;
  verificationToken: Scalars['String'];
}

export interface CheckVerificationPayload {
  __typename: 'CheckVerificationPayload';
  authToken: Maybe<Scalars['String']>;
  clientMutationId: Maybe<Scalars['String']>;
}

export interface CreateGameInput {
  clientMutationId?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  logo?: InputMaybe<Scalars['Upload']>;
  previewImg?: InputMaybe<Scalars['Upload']>;
  title: Scalars['String'];
  type: GameType;
}

export interface CreateGamePayload {
  __typename: 'CreateGamePayload';
  clientMutationId: Maybe<Scalars['String']>;
  game: Game;
}

export interface CreateGameVersionInput {
  clientMutationId?: InputMaybe<Scalars['String']>;
  content: Scalars['Upload'];
  gameId: Scalars['Int'];
  isDraft?: InputMaybe<Scalars['Boolean']>;
  postToDiscord?: InputMaybe<Scalars['Boolean']>;
}

export interface CreateGameVersionPayload {
  __typename: 'CreateGameVersionPayload';
  clientMutationId: Maybe<Scalars['String']>;
  congratulationMsg: Maybe<Scalars['String']>;
  gameVersion: GameVersion;
  previewLink: Scalars['String'];
}

export interface Game {
  __typename: 'Game';
  createdAt: Scalars['String'];
  description: Maybe<Scalars['String']>;
  gameDevs: GameDevsConnection;
  gameVersions: GameVersionsConnection;
  id: Scalars['Int'];
  /** Identifies the game in rune.ai URLs, such as its stats page. */
  key: Scalars['String'];
  logoUrl: Scalars['String'];
  previewImgUrl: Maybe<Scalars['String']>;
  title: Scalars['String'];
  type: GameType;
}


export interface GameGameVersionsArgs {
  orderBy?: InputMaybe<Array<GameVersionsOrderBy>>;
}

export interface GameDev {
  __typename: 'GameDev';
  displayName: Maybe<Scalars['String']>;
  type: GameDevType;
  userId: Scalars['Int'];
}

export enum GameDevType {
  ADMIN = 'ADMIN',
  DEV = 'DEV',
  TESTER = 'TESTER'
}

export interface GameDevsConnection {
  __typename: 'GameDevsConnection';
  nodes: Array<GameDev>;
}

export enum GameType {
  EXTERNAL = 'EXTERNAL',
  MULTIPLAYER = 'MULTIPLAYER'
}

export interface GameVersion {
  __typename: 'GameVersion';
  gameId: Scalars['Int'];
  gameVersionId: Scalars['Int'];
  status: GameVersionStatus;
}

export enum GameVersionStatus {
  ACTIVE = 'ACTIVE',
  DRAFT = 'DRAFT',
  INACTIVE = 'INACTIVE',
  IN_REVIEW = 'IN_REVIEW',
  UPLOADING = 'UPLOADING'
}

export interface GameVersionsConnection {
  __typename: 'GameVersionsConnection';
  nodes: Array<GameVersion>;
}

export enum GameVersionsOrderBy {
  PRIMARY_KEY_ASC = 'PRIMARY_KEY_ASC',
  PRIMARY_KEY_DESC = 'PRIMARY_KEY_DESC'
}

export interface GamesConnection {
  __typename: 'GamesConnection';
  nodes: Array<Game>;
}

export interface Me {
  __typename: 'Me';
  admin: Scalars['Boolean'];
  devId: Scalars['Int'];
  displayName: Scalars['String'];
  email: Maybe<Scalars['String']>;
}

export interface Mutation {
  __typename: 'Mutation';
  /** Step 2 of the CLI's magic-link login. The CLI polls this every 2s; authToken stays null until the emailed link is confirmed. */
  checkVerification: CheckVerificationPayload;
  /** Create a game and make the caller its ADMIN. Media is generated when no preview image is supplied. */
  createGame: CreateGamePayload;
  createGameVersion: CreateGameVersionPayload;
  /** Step 1 of the CLI's magic-link login. Emails a confirmation link and returns a token for polling checkVerification. Anonymous, and the response is identical whether or not the email has an account. */
  startVerification: StartVerificationPayload;
  /** Update a game's title, description or media. Blank fields are left unchanged rather than cleared. */
  updateGame: UpdateGamePayload;
}


export interface MutationCheckVerificationArgs {
  input: CheckVerificationInput;
}


export interface MutationCreateGameArgs {
  input: CreateGameInput;
}


export interface MutationCreateGameVersionArgs {
  input: CreateGameVersionInput;
}


export interface MutationStartVerificationArgs {
  input: StartVerificationInput;
}


export interface MutationUpdateGameArgs {
  input: UpdateGameInput;
}

export interface Query {
  __typename: 'Query';
  /** A single game, or null when the requester is not an ACTIVE member of it. */
  gameById: Maybe<Game>;
  /** Games the requester is an ACTIVE member of. Tango returned every game and left the filtering to the CLI. */
  games: GamesConnection;
  /** The authenticated dev. The CLI's LoginGate runs this on every start, so it doubles as the token-validity probe that clears a stale token. */
  me: Me;
}


export interface QueryGameByIdArgs {
  id: Scalars['Int'];
}

export interface StartVerificationInput {
  clientMutationId?: InputMaybe<Scalars['String']>;
  email: Scalars['String'];
}

export interface StartVerificationPayload {
  __typename: 'StartVerificationPayload';
  clientMutationId: Maybe<Scalars['String']>;
  verificationToken: Scalars['String'];
}

export interface UpdateGameInput {
  clientMutationId?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  gameId: Scalars['Int'];
  logo?: InputMaybe<Scalars['Upload']>;
  previewImg?: InputMaybe<Scalars['Upload']>;
  title?: InputMaybe<Scalars['String']>;
}

export interface UpdateGamePayload {
  __typename: 'UpdateGamePayload';
  clientMutationId: Maybe<Scalars['String']>;
  game: Game;
}

export type CheckVerificationMutationVariables = Exact<{
  verificationToken: Scalars['String'];
}>;


export type CheckVerificationMutation = { __typename: 'Mutation', checkVerification: { __typename: 'CheckVerificationPayload', authToken: string | null } };

export type CreateGameMutationVariables = Exact<{
  game: CreateGameInput;
}>;


export type CreateGameMutation = { __typename: 'Mutation', createGame: { __typename: 'CreateGamePayload', game: { __typename: 'Game', id: number } } };

export type CreateGameVersionMutationVariables = Exact<{
  gameId: Scalars['Int'];
  content: Scalars['Upload'];
  isDraft: Scalars['Boolean'];
  postToDiscord: Scalars['Boolean'];
}>;


export type CreateGameVersionMutation = { __typename: 'Mutation', createGameVersion: { __typename: 'CreateGameVersionPayload', previewLink: string, congratulationMsg: string | null, gameVersion: { __typename: 'GameVersion', gameId: number, gameVersionId: number } } };

export type GameQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type GameQuery = { __typename: 'Query', gameById: { __typename: 'Game', id: number, key: string, title: string, description: string | null, createdAt: string, gameDevs: { __typename: 'GameDevsConnection', nodes: Array<{ __typename: 'GameDev', userId: number, displayName: string | null, type: GameDevType }> }, gameVersions: { __typename: 'GameVersionsConnection', nodes: Array<{ __typename: 'GameVersion', gameId: number, gameVersionId: number, status: GameVersionStatus }> } } | null };

export type GamesQueryVariables = Exact<{ [key: string]: never; }>;


export type GamesQuery = { __typename: 'Query', games: { __typename: 'GamesConnection', nodes: Array<{ __typename: 'Game', id: number, key: string, title: string, description: string | null, gameDevs: { __typename: 'GameDevsConnection', nodes: Array<{ __typename: 'GameDev', userId: number, displayName: string | null, type: GameDevType }> }, gameVersions: { __typename: 'GameVersionsConnection', nodes: Array<{ __typename: 'GameVersion', gameId: number, gameVersionId: number, status: GameVersionStatus }> } }> } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename: 'Query', me: { __typename: 'Me', devId: number, displayName: string, email: string | null, admin: boolean } };

export type StartVerificationMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type StartVerificationMutation = { __typename: 'Mutation', startVerification: { __typename: 'StartVerificationPayload', verificationToken: string } };

export type UpdateGameMutationVariables = Exact<{
  input: UpdateGameInput;
}>;


export type UpdateGameMutation = { __typename: 'Mutation', updateGame: { __typename: 'UpdateGamePayload', game: { __typename: 'Game', id: number, title: string } } };

export type CheckVerificationPayloadKeySpecifier = ('authToken' | 'clientMutationId' | CheckVerificationPayloadKeySpecifier)[];
export type CheckVerificationPayloadFieldPolicy = {
	authToken?: FieldPolicy<any> | FieldReadFunction<any>,
	clientMutationId?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CreateGamePayloadKeySpecifier = ('clientMutationId' | 'game' | CreateGamePayloadKeySpecifier)[];
export type CreateGamePayloadFieldPolicy = {
	clientMutationId?: FieldPolicy<any> | FieldReadFunction<any>,
	game?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CreateGameVersionPayloadKeySpecifier = ('clientMutationId' | 'congratulationMsg' | 'gameVersion' | 'previewLink' | CreateGameVersionPayloadKeySpecifier)[];
export type CreateGameVersionPayloadFieldPolicy = {
	clientMutationId?: FieldPolicy<any> | FieldReadFunction<any>,
	congratulationMsg?: FieldPolicy<any> | FieldReadFunction<any>,
	gameVersion?: FieldPolicy<any> | FieldReadFunction<any>,
	previewLink?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GameKeySpecifier = ('createdAt' | 'description' | 'gameDevs' | 'gameVersions' | 'id' | 'key' | 'logoUrl' | 'previewImgUrl' | 'title' | 'type' | GameKeySpecifier)[];
export type GameFieldPolicy = {
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	gameDevs?: FieldPolicy<any> | FieldReadFunction<any>,
	gameVersions?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	key?: FieldPolicy<any> | FieldReadFunction<any>,
	logoUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	previewImgUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	title?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GameDevKeySpecifier = ('displayName' | 'type' | 'userId' | GameDevKeySpecifier)[];
export type GameDevFieldPolicy = {
	displayName?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	userId?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GameDevsConnectionKeySpecifier = ('nodes' | GameDevsConnectionKeySpecifier)[];
export type GameDevsConnectionFieldPolicy = {
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GameVersionKeySpecifier = ('gameId' | 'gameVersionId' | 'status' | GameVersionKeySpecifier)[];
export type GameVersionFieldPolicy = {
	gameId?: FieldPolicy<any> | FieldReadFunction<any>,
	gameVersionId?: FieldPolicy<any> | FieldReadFunction<any>,
	status?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GameVersionsConnectionKeySpecifier = ('nodes' | GameVersionsConnectionKeySpecifier)[];
export type GameVersionsConnectionFieldPolicy = {
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GamesConnectionKeySpecifier = ('nodes' | GamesConnectionKeySpecifier)[];
export type GamesConnectionFieldPolicy = {
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MeKeySpecifier = ('admin' | 'devId' | 'displayName' | 'email' | MeKeySpecifier)[];
export type MeFieldPolicy = {
	admin?: FieldPolicy<any> | FieldReadFunction<any>,
	devId?: FieldPolicy<any> | FieldReadFunction<any>,
	displayName?: FieldPolicy<any> | FieldReadFunction<any>,
	email?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MutationKeySpecifier = ('checkVerification' | 'createGame' | 'createGameVersion' | 'startVerification' | 'updateGame' | MutationKeySpecifier)[];
export type MutationFieldPolicy = {
	checkVerification?: FieldPolicy<any> | FieldReadFunction<any>,
	createGame?: FieldPolicy<any> | FieldReadFunction<any>,
	createGameVersion?: FieldPolicy<any> | FieldReadFunction<any>,
	startVerification?: FieldPolicy<any> | FieldReadFunction<any>,
	updateGame?: FieldPolicy<any> | FieldReadFunction<any>
};
export type QueryKeySpecifier = ('gameById' | 'games' | 'me' | QueryKeySpecifier)[];
export type QueryFieldPolicy = {
	gameById?: FieldPolicy<any> | FieldReadFunction<any>,
	games?: FieldPolicy<any> | FieldReadFunction<any>,
	me?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StartVerificationPayloadKeySpecifier = ('clientMutationId' | 'verificationToken' | StartVerificationPayloadKeySpecifier)[];
export type StartVerificationPayloadFieldPolicy = {
	clientMutationId?: FieldPolicy<any> | FieldReadFunction<any>,
	verificationToken?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UpdateGamePayloadKeySpecifier = ('clientMutationId' | 'game' | UpdateGamePayloadKeySpecifier)[];
export type UpdateGamePayloadFieldPolicy = {
	clientMutationId?: FieldPolicy<any> | FieldReadFunction<any>,
	game?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StrictTypedTypePolicies = {
	CheckVerificationPayload?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CheckVerificationPayloadKeySpecifier | (() => undefined | CheckVerificationPayloadKeySpecifier),
		fields?: CheckVerificationPayloadFieldPolicy,
	},
	CreateGamePayload?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CreateGamePayloadKeySpecifier | (() => undefined | CreateGamePayloadKeySpecifier),
		fields?: CreateGamePayloadFieldPolicy,
	},
	CreateGameVersionPayload?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CreateGameVersionPayloadKeySpecifier | (() => undefined | CreateGameVersionPayloadKeySpecifier),
		fields?: CreateGameVersionPayloadFieldPolicy,
	},
	Game?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GameKeySpecifier | (() => undefined | GameKeySpecifier),
		fields?: GameFieldPolicy,
	},
	GameDev?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GameDevKeySpecifier | (() => undefined | GameDevKeySpecifier),
		fields?: GameDevFieldPolicy,
	},
	GameDevsConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GameDevsConnectionKeySpecifier | (() => undefined | GameDevsConnectionKeySpecifier),
		fields?: GameDevsConnectionFieldPolicy,
	},
	GameVersion?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GameVersionKeySpecifier | (() => undefined | GameVersionKeySpecifier),
		fields?: GameVersionFieldPolicy,
	},
	GameVersionsConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GameVersionsConnectionKeySpecifier | (() => undefined | GameVersionsConnectionKeySpecifier),
		fields?: GameVersionsConnectionFieldPolicy,
	},
	GamesConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GamesConnectionKeySpecifier | (() => undefined | GamesConnectionKeySpecifier),
		fields?: GamesConnectionFieldPolicy,
	},
	Me?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MeKeySpecifier | (() => undefined | MeKeySpecifier),
		fields?: MeFieldPolicy,
	},
	Mutation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MutationKeySpecifier | (() => undefined | MutationKeySpecifier),
		fields?: MutationFieldPolicy,
	},
	Query?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | QueryKeySpecifier | (() => undefined | QueryKeySpecifier),
		fields?: QueryFieldPolicy,
	},
	StartVerificationPayload?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StartVerificationPayloadKeySpecifier | (() => undefined | StartVerificationPayloadKeySpecifier),
		fields?: StartVerificationPayloadFieldPolicy,
	},
	UpdateGamePayload?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UpdateGamePayloadKeySpecifier | (() => undefined | UpdateGamePayloadKeySpecifier),
		fields?: UpdateGamePayloadFieldPolicy,
	}
};
export type TypedTypePolicies = StrictTypedTypePolicies & TypePolicies;

export const CheckVerificationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CheckVerification"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"verificationToken"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"checkVerification"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"verificationToken"},"value":{"kind":"Variable","name":{"kind":"Name","value":"verificationToken"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"authToken"}}]}}]}}]} as unknown as DocumentNode<CheckVerificationMutation, CheckVerificationMutationVariables>;
export const CreateGameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateGame"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"game"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateGameInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createGame"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"game"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"game"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<CreateGameMutation, CreateGameMutationVariables>;
export const CreateGameVersionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateGameVersion"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"content"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Upload"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isDraft"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"postToDiscord"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createGameVersion"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"gameId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"content"},"value":{"kind":"Variable","name":{"kind":"Name","value":"content"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"isDraft"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isDraft"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"postToDiscord"},"value":{"kind":"Variable","name":{"kind":"Name","value":"postToDiscord"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"previewLink"}},{"kind":"Field","name":{"kind":"Name","value":"congratulationMsg"}},{"kind":"Field","name":{"kind":"Name","value":"gameVersion"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gameId"}},{"kind":"Field","name":{"kind":"Name","value":"gameVersionId"}}]}}]}}]}}]} as unknown as DocumentNode<CreateGameVersionMutation, CreateGameVersionMutationVariables>;
export const GameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Game"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gameById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"gameDevs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"gameVersions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"PRIMARY_KEY_DESC"}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gameId"}},{"kind":"Field","name":{"kind":"Name","value":"gameVersionId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GameQuery, GameQueryVariables>;
export const GamesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Games"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"games"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"gameDevs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"gameVersions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"PRIMARY_KEY_DESC"}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gameId"}},{"kind":"Field","name":{"kind":"Name","value":"gameVersionId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GamesQuery, GamesQueryVariables>;
export const MeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"devId"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"admin"}}]}}]}}]} as unknown as DocumentNode<MeQuery, MeQueryVariables>;
export const StartVerificationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"StartVerification"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startVerification"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verificationToken"}}]}}]}}]} as unknown as DocumentNode<StartVerificationMutation, StartVerificationMutationVariables>;
export const UpdateGameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateGame"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateGameInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateGame"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"game"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateGameMutation, UpdateGameMutationVariables>;