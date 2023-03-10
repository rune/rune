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
  Cursor: any;
  Datetime: string;
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
  title: Scalars['String'];
  type: GameType;
}

export interface CreateGamePayload {
  __typename: 'CreateGamePayload';
  clientMutationId: Maybe<Scalars['String']>;
  game: Game;
}

export interface CreateGameVersionInput {
  challengeSupport?: InputMaybe<Scalars['Boolean']>;
  clientMutationId?: InputMaybe<Scalars['String']>;
  content: Scalars['Upload'];
  gameId: Scalars['Int'];
}

export interface CreateGameVersionPayload {
  __typename: 'CreateGameVersionPayload';
  clientMutationId: Maybe<Scalars['String']>;
  gameVersion: GameVersion;
  previewLink: Scalars['String'];
}

export interface DevTeam {
  __typename: 'DevTeam';
  admin: Scalars['Boolean'];
  createdAt: Scalars['Datetime'];
  email: Maybe<Scalars['String']>;
  /** Reads and enables pagination through a set of `Game`. */
  games: GamesConnection;
  handle: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  unsubscribedFromEmailsAt: Maybe<Scalars['Datetime']>;
  updatedAt: Scalars['Datetime'];
}


export interface DevTeamGamesArgs {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<GameCondition>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<GamesOrderBy>>;
}

/** A condition to be used against `DevTeam` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export interface DevTeamCondition {
  /** Checks for equality with the object’s `email` field. */
  email?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `handle` field. */
  handle?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']>;
}

/** Represents an update to a `DevTeam`. Fields that are set will be updated. */
export interface DevTeamPatch {
  handle?: InputMaybe<Scalars['String']>;
}

/** A connection to a list of `DevTeam` values. */
export interface DevTeamsConnection {
  __typename: 'DevTeamsConnection';
  /** A list of edges which contains the `DevTeam` and cursor to aid in pagination. */
  edges: Array<DevTeamsEdge>;
  /** A list of `DevTeam` objects. */
  nodes: Array<DevTeam>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `DevTeam` you could get from the connection. */
  totalCount: Scalars['Int'];
}

/** A `DevTeam` edge in the connection. */
export interface DevTeamsEdge {
  __typename: 'DevTeamsEdge';
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars['Cursor']>;
  /** The `DevTeam` at the end of the edge. */
  node: DevTeam;
}

/** Methods to use when ordering `DevTeam`. */
export enum DevTeamsOrderBy {
  EMAIL_ASC = 'EMAIL_ASC',
  EMAIL_DESC = 'EMAIL_DESC',
  HANDLE_ASC = 'HANDLE_ASC',
  HANDLE_DESC = 'HANDLE_DESC',
  ID_ASC = 'ID_ASC',
  ID_DESC = 'ID_DESC',
  NATURAL = 'NATURAL',
  PRIMARY_KEY_ASC = 'PRIMARY_KEY_ASC',
  PRIMARY_KEY_DESC = 'PRIMARY_KEY_DESC'
}

export interface Game {
  __typename: 'Game';
  blurredImgDataUrl: Maybe<Scalars['String']>;
  /** Challenge number that increases every day by 1 at tango.next_challenge_at */
  challengeId: Scalars['Int'];
  /** (Denormalized) Total number of comments . */
  commentCount: Scalars['Int'];
  createdAt: Scalars['Datetime'];
  description: Maybe<Scalars['String']>;
  /** Reads a single `DevTeam` that is related to this `Game`. */
  devTeam: Maybe<DevTeam>;
  devTeamId: Scalars['Int'];
  /** Reads and enables pagination through a set of `GameVersion`. */
  gameVersions: GameVersionsConnection;
  id: Scalars['Int'];
  logoUrl: Scalars['String'];
  /** NULL means that the challenge is disabled. Once enabled, challenge cannot be disabled. */
  nextChallengeAt: Maybe<Scalars['Datetime']>;
  /**
   * Sum of the deprecated game_session table rows
   * with duration longer than 3s
   * as well as the new game_play table rows
   * with duration longer than 3s.
   * Note that the sum exludes game plays longer than 86.4s created between 2022-05-26 and 2022-05-31 due to RUNE-7891.
   */
  playCount: Scalars['Int'];
  title: Scalars['String'];
  type: GameType;
  updatedAt: Scalars['Datetime'];
}


export interface GameGameVersionsArgs {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<GameVersionCondition>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<GameVersionsOrderBy>>;
}

/** A condition to be used against `Game` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export interface GameCondition {
  /** Checks for equality with the object’s `devTeamId` field. */
  devTeamId?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `nextChallengeAt` field. */
  nextChallengeAt?: InputMaybe<Scalars['Datetime']>;
}

export interface GameFile {
  content?: InputMaybe<Scalars['String']>;
  path: Scalars['String'];
  size: Scalars['Int'];
}

export enum GameType {
  EXTERNAL = 'EXTERNAL',
  MULTIPLAYER = 'MULTIPLAYER',
  SINGLEPLAYER = 'SINGLEPLAYER'
}

export interface GameValidationError {
  __typename: 'GameValidationError';
  lintErrors: Maybe<Array<GameValidationLintError>>;
  message: Scalars['String'];
}

export interface GameValidationLintError {
  __typename: 'GameValidationLintError';
  column: Scalars['Int'];
  endColumn: Maybe<Scalars['Int']>;
  endLine: Maybe<Scalars['Int']>;
  line: Scalars['Int'];
  message: Maybe<Scalars['String']>;
  ruleId: Maybe<Scalars['String']>;
}

export interface GameVersion {
  __typename: 'GameVersion';
  createdByDevTeamId: Maybe<Scalars['Int']>;
  /** Reads a single `Game` that is related to this `GameVersion`. */
  game: Maybe<Game>;
  gameId: Scalars['Int'];
  gameVersionId: Scalars['Int'];
  multiplayerMaxPlayers: Scalars['Int'];
  multiplayerMinPlayers: Scalars['Int'];
  multiplayerSupportsPlayerJoining: Scalars['Boolean'];
  multiplayerSupportsPlayerLeaving: Scalars['Boolean'];
  status: GameVersionStatus;
  supportsChallenge: Scalars['Boolean'];
}

/**
 * A condition to be used against `GameVersion` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export interface GameVersionCondition {
  /** Checks for equality with the object’s `gameId` field. */
  gameId?: InputMaybe<Scalars['Int']>;
}

export enum GameVersionStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  IN_REVIEW = 'IN_REVIEW',
  UPLOADING = 'UPLOADING',
  WAITING_FOR_RELEASE = 'WAITING_FOR_RELEASE'
}

/** A connection to a list of `GameVersion` values. */
export interface GameVersionsConnection {
  __typename: 'GameVersionsConnection';
  /** A list of edges which contains the `GameVersion` and cursor to aid in pagination. */
  edges: Array<GameVersionsEdge>;
  /** A list of `GameVersion` objects. */
  nodes: Array<GameVersion>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `GameVersion` you could get from the connection. */
  totalCount: Scalars['Int'];
}

/** A `GameVersion` edge in the connection. */
export interface GameVersionsEdge {
  __typename: 'GameVersionsEdge';
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars['Cursor']>;
  /** The `GameVersion` at the end of the edge. */
  node: GameVersion;
}

/** Methods to use when ordering `GameVersion`. */
export enum GameVersionsOrderBy {
  GAME_ID_ASC = 'GAME_ID_ASC',
  GAME_ID_DESC = 'GAME_ID_DESC',
  NATURAL = 'NATURAL',
  PRIMARY_KEY_ASC = 'PRIMARY_KEY_ASC',
  PRIMARY_KEY_DESC = 'PRIMARY_KEY_DESC'
}

/** A connection to a list of `Game` values. */
export interface GamesConnection {
  __typename: 'GamesConnection';
  /** A list of edges which contains the `Game` and cursor to aid in pagination. */
  edges: Array<GamesEdge>;
  /** A list of `Game` objects. */
  nodes: Array<Game>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Game` you could get from the connection. */
  totalCount: Scalars['Int'];
}

/** A `Game` edge in the connection. */
export interface GamesEdge {
  __typename: 'GamesEdge';
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars['Cursor']>;
  /** The `Game` at the end of the edge. */
  node: Game;
}

/** Methods to use when ordering `Game`. */
export enum GamesOrderBy {
  DEV_TEAM_ID_ASC = 'DEV_TEAM_ID_ASC',
  DEV_TEAM_ID_DESC = 'DEV_TEAM_ID_DESC',
  ID_ASC = 'ID_ASC',
  ID_DESC = 'ID_DESC',
  NATURAL = 'NATURAL',
  NEXT_CHALLENGE_AT_ASC = 'NEXT_CHALLENGE_AT_ASC',
  NEXT_CHALLENGE_AT_DESC = 'NEXT_CHALLENGE_AT_DESC',
  PRIMARY_KEY_ASC = 'PRIMARY_KEY_ASC',
  PRIMARY_KEY_DESC = 'PRIMARY_KEY_DESC'
}

/** The root mutation type which contains root level fields which mutate data. */
export interface Mutation {
  __typename: 'Mutation';
  checkVerification: CheckVerificationPayload;
  createGame: CreateGamePayload;
  createGameVersion: CreateGameVersionPayload;
  startVerification: StartVerificationPayload;
  /** Updates a single `DevTeam` using a unique key and a patch. */
  updateDevTeamByEmail: Maybe<UpdateDevTeamPayload>;
  /** Updates a single `DevTeam` using a unique key and a patch. */
  updateDevTeamByHandle: Maybe<UpdateDevTeamPayload>;
  /** Updates a single `DevTeam` using a unique key and a patch. */
  updateDevTeamById: Maybe<UpdateDevTeamPayload>;
  updateGame: UpdateGamePayload;
  updateGameSdk: UpdateGameSdkPayload;
  validateGame: ValidateGamePayload;
}


/** The root mutation type which contains root level fields which mutate data. */
export interface MutationCheckVerificationArgs {
  input: CheckVerificationInput;
}


/** The root mutation type which contains root level fields which mutate data. */
export interface MutationCreateGameArgs {
  input: CreateGameInput;
}


/** The root mutation type which contains root level fields which mutate data. */
export interface MutationCreateGameVersionArgs {
  input: CreateGameVersionInput;
}


/** The root mutation type which contains root level fields which mutate data. */
export interface MutationStartVerificationArgs {
  input: StartVerificationInput;
}


/** The root mutation type which contains root level fields which mutate data. */
export interface MutationUpdateDevTeamByEmailArgs {
  input: UpdateDevTeamByEmailInput;
}


/** The root mutation type which contains root level fields which mutate data. */
export interface MutationUpdateDevTeamByHandleArgs {
  input: UpdateDevTeamByHandleInput;
}


/** The root mutation type which contains root level fields which mutate data. */
export interface MutationUpdateDevTeamByIdArgs {
  input: UpdateDevTeamByIdInput;
}


/** The root mutation type which contains root level fields which mutate data. */
export interface MutationUpdateGameArgs {
  input: UpdateGameInput;
}


/** The root mutation type which contains root level fields which mutate data. */
export interface MutationUpdateGameSdkArgs {
  input: UpdateGameSdkInput;
}


/** The root mutation type which contains root level fields which mutate data. */
export interface MutationValidateGameArgs {
  input: ValidateGameInput;
}

/** Information about pagination in a connection. */
export interface PageInfo {
  __typename: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor: Maybe<Scalars['Cursor']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean'];
  /** When paginating backwards, the cursor to continue. */
  startCursor: Maybe<Scalars['Cursor']>;
}

/** The root query type which gives access points into the data universe. */
export interface Query {
  __typename: 'Query';
  devTeamByEmail: Maybe<DevTeam>;
  devTeamByHandle: Maybe<DevTeam>;
  devTeamById: Maybe<DevTeam>;
  /** Reads and enables pagination through a set of `DevTeam`. */
  devTeams: Maybe<DevTeamsConnection>;
  gameById: Maybe<Game>;
  gameVersionByGameIdAndGameVersionId: Maybe<GameVersion>;
  /** Reads and enables pagination through a set of `GameVersion`. */
  gameVersions: Maybe<GameVersionsConnection>;
  /** Reads and enables pagination through a set of `Game`. */
  games: Maybe<GamesConnection>;
  me: DevTeam;
  /**
   * Exposes the root query type nested one level down. This is helpful for Relay 1
   * which can only query top level fields if they are in a particular form.
   */
  query: Query;
}


/** The root query type which gives access points into the data universe. */
export interface QueryDevTeamByEmailArgs {
  email: Scalars['String'];
}


/** The root query type which gives access points into the data universe. */
export interface QueryDevTeamByHandleArgs {
  handle: Scalars['String'];
}


/** The root query type which gives access points into the data universe. */
export interface QueryDevTeamByIdArgs {
  id: Scalars['Int'];
}


/** The root query type which gives access points into the data universe. */
export interface QueryDevTeamsArgs {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<DevTeamCondition>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<DevTeamsOrderBy>>;
}


/** The root query type which gives access points into the data universe. */
export interface QueryGameByIdArgs {
  id: Scalars['Int'];
}


/** The root query type which gives access points into the data universe. */
export interface QueryGameVersionByGameIdAndGameVersionIdArgs {
  gameId: Scalars['Int'];
  gameVersionId: Scalars['Int'];
}


/** The root query type which gives access points into the data universe. */
export interface QueryGameVersionsArgs {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<GameVersionCondition>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<GameVersionsOrderBy>>;
}


/** The root query type which gives access points into the data universe. */
export interface QueryGamesArgs {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<GameCondition>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<GamesOrderBy>>;
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

/** All input for the `updateDevTeamByEmail` mutation. */
export interface UpdateDevTeamByEmailInput {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  email: Scalars['String'];
  /** An object where the defined keys will be set on the `DevTeam` being updated. */
  patch: DevTeamPatch;
}

/** All input for the `updateDevTeamByHandle` mutation. */
export interface UpdateDevTeamByHandleInput {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  handle: Scalars['String'];
  /** An object where the defined keys will be set on the `DevTeam` being updated. */
  patch: DevTeamPatch;
}

/** All input for the `updateDevTeamById` mutation. */
export interface UpdateDevTeamByIdInput {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  id: Scalars['Int'];
  /** An object where the defined keys will be set on the `DevTeam` being updated. */
  patch: DevTeamPatch;
}

/** The output of our update `DevTeam` mutation. */
export interface UpdateDevTeamPayload {
  __typename: 'UpdateDevTeamPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId: Maybe<Scalars['String']>;
  /** The `DevTeam` that was updated by this mutation. */
  devTeam: Maybe<DevTeam>;
  /** An edge for our `DevTeam`. May be used by Relay 1. */
  devTeamEdge: Maybe<DevTeamsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query: Maybe<Query>;
}


/** The output of our update `DevTeam` mutation. */
export interface UpdateDevTeamPayloadDevTeamEdgeArgs {
  orderBy?: InputMaybe<Array<DevTeamsOrderBy>>;
}

export interface UpdateGameInput {
  clientMutationId?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  gameId: Scalars['Int'];
  logo?: InputMaybe<Scalars['Upload']>;
  title?: InputMaybe<Scalars['String']>;
}

export interface UpdateGamePayload {
  __typename: 'UpdateGamePayload';
  clientMutationId: Maybe<Scalars['String']>;
  game: Game;
}

export interface UpdateGameSdkInput {
  clientMutationId?: InputMaybe<Scalars['String']>;
  gameId: Scalars['Int'];
  gameVersionId: Scalars['Int'];
}

export interface UpdateGameSdkPayload {
  __typename: 'UpdateGameSdkPayload';
  clientMutationId: Maybe<Scalars['String']>;
  error: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
}

export interface ValidateGameInput {
  clientMutationId?: InputMaybe<Scalars['String']>;
  files: Array<GameFile>;
}

export interface ValidateGamePayload {
  __typename: 'ValidateGamePayload';
  clientMutationId: Maybe<Scalars['String']>;
  errors: Array<GameValidationError>;
  valid: Scalars['Boolean'];
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
  challengeSupport?: Maybe<Scalars['Boolean']>;
}>;


export type CreateGameVersionMutation = { __typename: 'Mutation', createGameVersion: { __typename: 'CreateGameVersionPayload', previewLink: string, gameVersion: { __typename: 'GameVersion', gameId: number, gameVersionId: number } } };

export type GameQueryVariables = Exact<{
  id: Scalars['Int'];
}>;


export type GameQuery = { __typename: 'Query', gameById: { __typename: 'Game', id: number, title: string, description: string | null, createdAt: string, gameVersions: { __typename: 'GameVersionsConnection', nodes: Array<{ __typename: 'GameVersion', gameId: number, gameVersionId: number, supportsChallenge: boolean, status: GameVersionStatus }> } } | null };

export type GamesQueryVariables = Exact<{
  condition?: Maybe<GameCondition>;
}>;


export type GamesQuery = { __typename: 'Query', games: { __typename: 'GamesConnection', nodes: Array<{ __typename: 'Game', id: number, title: string, devTeam: { __typename: 'DevTeam', id: number, handle: string | null } | null, gameVersions: { __typename: 'GameVersionsConnection', nodes: Array<{ __typename: 'GameVersion', gameId: number, gameVersionId: number, status: GameVersionStatus, supportsChallenge: boolean }> } }> } | null };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename: 'Query', me: { __typename: 'DevTeam', id: number, handle: string | null, email: string | null, admin: boolean } };

export type StartVerificationMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type StartVerificationMutation = { __typename: 'Mutation', startVerification: { __typename: 'StartVerificationPayload', verificationToken: string } };

export type UpdateDevTeamByIdMutationVariables = Exact<{
  id: Scalars['Int'];
  patch: DevTeamPatch;
}>;


export type UpdateDevTeamByIdMutation = { __typename: 'Mutation', updateDevTeamById: { __typename: 'UpdateDevTeamPayload', devTeam: { __typename: 'DevTeam', id: number, handle: string | null } | null } | null };

export type UpdateGameMutationVariables = Exact<{
  input: UpdateGameInput;
}>;


export type UpdateGameMutation = { __typename: 'Mutation', updateGame: { __typename: 'UpdateGamePayload', game: { __typename: 'Game', id: number, title: string } } };

export type UpdateGameSdkMutationVariables = Exact<{
  input: UpdateGameSdkInput;
}>;


export type UpdateGameSdkMutation = { __typename: 'Mutation', updateGameSdk: { __typename: 'UpdateGameSdkPayload', success: boolean, error: string | null } };

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
export type CreateGameVersionPayloadKeySpecifier = ('clientMutationId' | 'gameVersion' | 'previewLink' | CreateGameVersionPayloadKeySpecifier)[];
export type CreateGameVersionPayloadFieldPolicy = {
	clientMutationId?: FieldPolicy<any> | FieldReadFunction<any>,
	gameVersion?: FieldPolicy<any> | FieldReadFunction<any>,
	previewLink?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DevTeamKeySpecifier = ('admin' | 'createdAt' | 'email' | 'games' | 'handle' | 'id' | 'unsubscribedFromEmailsAt' | 'updatedAt' | DevTeamKeySpecifier)[];
export type DevTeamFieldPolicy = {
	admin?: FieldPolicy<any> | FieldReadFunction<any>,
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	email?: FieldPolicy<any> | FieldReadFunction<any>,
	games?: FieldPolicy<any> | FieldReadFunction<any>,
	handle?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	unsubscribedFromEmailsAt?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DevTeamsConnectionKeySpecifier = ('edges' | 'nodes' | 'pageInfo' | 'totalCount' | DevTeamsConnectionKeySpecifier)[];
export type DevTeamsConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DevTeamsEdgeKeySpecifier = ('cursor' | 'node' | DevTeamsEdgeKeySpecifier)[];
export type DevTeamsEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GameKeySpecifier = ('blurredImgDataUrl' | 'challengeId' | 'commentCount' | 'createdAt' | 'description' | 'devTeam' | 'devTeamId' | 'gameVersions' | 'id' | 'logoUrl' | 'nextChallengeAt' | 'playCount' | 'title' | 'type' | 'updatedAt' | GameKeySpecifier)[];
export type GameFieldPolicy = {
	blurredImgDataUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	challengeId?: FieldPolicy<any> | FieldReadFunction<any>,
	commentCount?: FieldPolicy<any> | FieldReadFunction<any>,
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	description?: FieldPolicy<any> | FieldReadFunction<any>,
	devTeam?: FieldPolicy<any> | FieldReadFunction<any>,
	devTeamId?: FieldPolicy<any> | FieldReadFunction<any>,
	gameVersions?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	logoUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	nextChallengeAt?: FieldPolicy<any> | FieldReadFunction<any>,
	playCount?: FieldPolicy<any> | FieldReadFunction<any>,
	title?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GameValidationErrorKeySpecifier = ('lintErrors' | 'message' | GameValidationErrorKeySpecifier)[];
export type GameValidationErrorFieldPolicy = {
	lintErrors?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GameValidationLintErrorKeySpecifier = ('column' | 'endColumn' | 'endLine' | 'line' | 'message' | 'ruleId' | GameValidationLintErrorKeySpecifier)[];
export type GameValidationLintErrorFieldPolicy = {
	column?: FieldPolicy<any> | FieldReadFunction<any>,
	endColumn?: FieldPolicy<any> | FieldReadFunction<any>,
	endLine?: FieldPolicy<any> | FieldReadFunction<any>,
	line?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	ruleId?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GameVersionKeySpecifier = ('createdByDevTeamId' | 'game' | 'gameId' | 'gameVersionId' | 'multiplayerMaxPlayers' | 'multiplayerMinPlayers' | 'multiplayerSupportsPlayerJoining' | 'multiplayerSupportsPlayerLeaving' | 'status' | 'supportsChallenge' | GameVersionKeySpecifier)[];
export type GameVersionFieldPolicy = {
	createdByDevTeamId?: FieldPolicy<any> | FieldReadFunction<any>,
	game?: FieldPolicy<any> | FieldReadFunction<any>,
	gameId?: FieldPolicy<any> | FieldReadFunction<any>,
	gameVersionId?: FieldPolicy<any> | FieldReadFunction<any>,
	multiplayerMaxPlayers?: FieldPolicy<any> | FieldReadFunction<any>,
	multiplayerMinPlayers?: FieldPolicy<any> | FieldReadFunction<any>,
	multiplayerSupportsPlayerJoining?: FieldPolicy<any> | FieldReadFunction<any>,
	multiplayerSupportsPlayerLeaving?: FieldPolicy<any> | FieldReadFunction<any>,
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	supportsChallenge?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GameVersionsConnectionKeySpecifier = ('edges' | 'nodes' | 'pageInfo' | 'totalCount' | GameVersionsConnectionKeySpecifier)[];
export type GameVersionsConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GameVersionsEdgeKeySpecifier = ('cursor' | 'node' | GameVersionsEdgeKeySpecifier)[];
export type GameVersionsEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GamesConnectionKeySpecifier = ('edges' | 'nodes' | 'pageInfo' | 'totalCount' | GamesConnectionKeySpecifier)[];
export type GamesConnectionFieldPolicy = {
	edges?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>,
	pageInfo?: FieldPolicy<any> | FieldReadFunction<any>,
	totalCount?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GamesEdgeKeySpecifier = ('cursor' | 'node' | GamesEdgeKeySpecifier)[];
export type GamesEdgeFieldPolicy = {
	cursor?: FieldPolicy<any> | FieldReadFunction<any>,
	node?: FieldPolicy<any> | FieldReadFunction<any>
};
export type MutationKeySpecifier = ('checkVerification' | 'createGame' | 'createGameVersion' | 'startVerification' | 'updateDevTeamByEmail' | 'updateDevTeamByHandle' | 'updateDevTeamById' | 'updateGame' | 'updateGameSdk' | 'validateGame' | MutationKeySpecifier)[];
export type MutationFieldPolicy = {
	checkVerification?: FieldPolicy<any> | FieldReadFunction<any>,
	createGame?: FieldPolicy<any> | FieldReadFunction<any>,
	createGameVersion?: FieldPolicy<any> | FieldReadFunction<any>,
	startVerification?: FieldPolicy<any> | FieldReadFunction<any>,
	updateDevTeamByEmail?: FieldPolicy<any> | FieldReadFunction<any>,
	updateDevTeamByHandle?: FieldPolicy<any> | FieldReadFunction<any>,
	updateDevTeamById?: FieldPolicy<any> | FieldReadFunction<any>,
	updateGame?: FieldPolicy<any> | FieldReadFunction<any>,
	updateGameSdk?: FieldPolicy<any> | FieldReadFunction<any>,
	validateGame?: FieldPolicy<any> | FieldReadFunction<any>
};
export type PageInfoKeySpecifier = ('endCursor' | 'hasNextPage' | 'hasPreviousPage' | 'startCursor' | PageInfoKeySpecifier)[];
export type PageInfoFieldPolicy = {
	endCursor?: FieldPolicy<any> | FieldReadFunction<any>,
	hasNextPage?: FieldPolicy<any> | FieldReadFunction<any>,
	hasPreviousPage?: FieldPolicy<any> | FieldReadFunction<any>,
	startCursor?: FieldPolicy<any> | FieldReadFunction<any>
};
export type QueryKeySpecifier = ('devTeamByEmail' | 'devTeamByHandle' | 'devTeamById' | 'devTeams' | 'gameById' | 'gameVersionByGameIdAndGameVersionId' | 'gameVersions' | 'games' | 'me' | 'query' | QueryKeySpecifier)[];
export type QueryFieldPolicy = {
	devTeamByEmail?: FieldPolicy<any> | FieldReadFunction<any>,
	devTeamByHandle?: FieldPolicy<any> | FieldReadFunction<any>,
	devTeamById?: FieldPolicy<any> | FieldReadFunction<any>,
	devTeams?: FieldPolicy<any> | FieldReadFunction<any>,
	gameById?: FieldPolicy<any> | FieldReadFunction<any>,
	gameVersionByGameIdAndGameVersionId?: FieldPolicy<any> | FieldReadFunction<any>,
	gameVersions?: FieldPolicy<any> | FieldReadFunction<any>,
	games?: FieldPolicy<any> | FieldReadFunction<any>,
	me?: FieldPolicy<any> | FieldReadFunction<any>,
	query?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StartVerificationPayloadKeySpecifier = ('clientMutationId' | 'verificationToken' | StartVerificationPayloadKeySpecifier)[];
export type StartVerificationPayloadFieldPolicy = {
	clientMutationId?: FieldPolicy<any> | FieldReadFunction<any>,
	verificationToken?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UpdateDevTeamPayloadKeySpecifier = ('clientMutationId' | 'devTeam' | 'devTeamEdge' | 'query' | UpdateDevTeamPayloadKeySpecifier)[];
export type UpdateDevTeamPayloadFieldPolicy = {
	clientMutationId?: FieldPolicy<any> | FieldReadFunction<any>,
	devTeam?: FieldPolicy<any> | FieldReadFunction<any>,
	devTeamEdge?: FieldPolicy<any> | FieldReadFunction<any>,
	query?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UpdateGamePayloadKeySpecifier = ('clientMutationId' | 'game' | UpdateGamePayloadKeySpecifier)[];
export type UpdateGamePayloadFieldPolicy = {
	clientMutationId?: FieldPolicy<any> | FieldReadFunction<any>,
	game?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UpdateGameSdkPayloadKeySpecifier = ('clientMutationId' | 'error' | 'success' | UpdateGameSdkPayloadKeySpecifier)[];
export type UpdateGameSdkPayloadFieldPolicy = {
	clientMutationId?: FieldPolicy<any> | FieldReadFunction<any>,
	error?: FieldPolicy<any> | FieldReadFunction<any>,
	success?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ValidateGamePayloadKeySpecifier = ('clientMutationId' | 'errors' | 'valid' | ValidateGamePayloadKeySpecifier)[];
export type ValidateGamePayloadFieldPolicy = {
	clientMutationId?: FieldPolicy<any> | FieldReadFunction<any>,
	errors?: FieldPolicy<any> | FieldReadFunction<any>,
	valid?: FieldPolicy<any> | FieldReadFunction<any>
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
	DevTeam?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DevTeamKeySpecifier | (() => undefined | DevTeamKeySpecifier),
		fields?: DevTeamFieldPolicy,
	},
	DevTeamsConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DevTeamsConnectionKeySpecifier | (() => undefined | DevTeamsConnectionKeySpecifier),
		fields?: DevTeamsConnectionFieldPolicy,
	},
	DevTeamsEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DevTeamsEdgeKeySpecifier | (() => undefined | DevTeamsEdgeKeySpecifier),
		fields?: DevTeamsEdgeFieldPolicy,
	},
	Game?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GameKeySpecifier | (() => undefined | GameKeySpecifier),
		fields?: GameFieldPolicy,
	},
	GameValidationError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GameValidationErrorKeySpecifier | (() => undefined | GameValidationErrorKeySpecifier),
		fields?: GameValidationErrorFieldPolicy,
	},
	GameValidationLintError?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GameValidationLintErrorKeySpecifier | (() => undefined | GameValidationLintErrorKeySpecifier),
		fields?: GameValidationLintErrorFieldPolicy,
	},
	GameVersion?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GameVersionKeySpecifier | (() => undefined | GameVersionKeySpecifier),
		fields?: GameVersionFieldPolicy,
	},
	GameVersionsConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GameVersionsConnectionKeySpecifier | (() => undefined | GameVersionsConnectionKeySpecifier),
		fields?: GameVersionsConnectionFieldPolicy,
	},
	GameVersionsEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GameVersionsEdgeKeySpecifier | (() => undefined | GameVersionsEdgeKeySpecifier),
		fields?: GameVersionsEdgeFieldPolicy,
	},
	GamesConnection?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GamesConnectionKeySpecifier | (() => undefined | GamesConnectionKeySpecifier),
		fields?: GamesConnectionFieldPolicy,
	},
	GamesEdge?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GamesEdgeKeySpecifier | (() => undefined | GamesEdgeKeySpecifier),
		fields?: GamesEdgeFieldPolicy,
	},
	Mutation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | MutationKeySpecifier | (() => undefined | MutationKeySpecifier),
		fields?: MutationFieldPolicy,
	},
	PageInfo?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | PageInfoKeySpecifier | (() => undefined | PageInfoKeySpecifier),
		fields?: PageInfoFieldPolicy,
	},
	Query?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | QueryKeySpecifier | (() => undefined | QueryKeySpecifier),
		fields?: QueryFieldPolicy,
	},
	StartVerificationPayload?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | StartVerificationPayloadKeySpecifier | (() => undefined | StartVerificationPayloadKeySpecifier),
		fields?: StartVerificationPayloadFieldPolicy,
	},
	UpdateDevTeamPayload?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UpdateDevTeamPayloadKeySpecifier | (() => undefined | UpdateDevTeamPayloadKeySpecifier),
		fields?: UpdateDevTeamPayloadFieldPolicy,
	},
	UpdateGamePayload?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UpdateGamePayloadKeySpecifier | (() => undefined | UpdateGamePayloadKeySpecifier),
		fields?: UpdateGamePayloadFieldPolicy,
	},
	UpdateGameSdkPayload?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UpdateGameSdkPayloadKeySpecifier | (() => undefined | UpdateGameSdkPayloadKeySpecifier),
		fields?: UpdateGameSdkPayloadFieldPolicy,
	},
	ValidateGamePayload?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ValidateGamePayloadKeySpecifier | (() => undefined | ValidateGamePayloadKeySpecifier),
		fields?: ValidateGamePayloadFieldPolicy,
	}
};
export type TypedTypePolicies = StrictTypedTypePolicies & TypePolicies;

export const CheckVerificationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CheckVerification"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"verificationToken"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"checkVerification"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"verificationToken"},"value":{"kind":"Variable","name":{"kind":"Name","value":"verificationToken"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"authToken"}}]}}]}}]} as unknown as DocumentNode<CheckVerificationMutation, CheckVerificationMutationVariables>;
export const CreateGameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateGame"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"game"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateGameInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createGame"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"game"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"game"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<CreateGameMutation, CreateGameMutationVariables>;
export const CreateGameVersionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateGameVersion"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"content"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Upload"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"challengeSupport"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createGameVersion"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"gameId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gameId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"content"},"value":{"kind":"Variable","name":{"kind":"Name","value":"content"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"challengeSupport"},"value":{"kind":"Variable","name":{"kind":"Name","value":"challengeSupport"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"previewLink"}},{"kind":"Field","name":{"kind":"Name","value":"gameVersion"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gameId"}},{"kind":"Field","name":{"kind":"Name","value":"gameVersionId"}}]}}]}}]}}]} as unknown as DocumentNode<CreateGameVersionMutation, CreateGameVersionMutationVariables>;
export const GameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Game"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gameById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"gameVersions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"PRIMARY_KEY_DESC"}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gameId"}},{"kind":"Field","name":{"kind":"Name","value":"gameVersionId"}},{"kind":"Field","name":{"kind":"Name","value":"supportsChallenge"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GameQuery, GameQueryVariables>;
export const GamesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Games"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"condition"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"GameCondition"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"games"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"condition"},"value":{"kind":"Variable","name":{"kind":"Name","value":"condition"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"PRIMARY_KEY_DESC"}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"devTeam"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"handle"}}]}},{"kind":"Field","name":{"kind":"Name","value":"gameVersions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"PRIMARY_KEY_DESC"}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gameId"}},{"kind":"Field","name":{"kind":"Name","value":"gameVersionId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"supportsChallenge"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GamesQuery, GamesQueryVariables>;
export const MeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"handle"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"admin"}}]}}]}}]} as unknown as DocumentNode<MeQuery, MeQueryVariables>;
export const StartVerificationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"StartVerification"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startVerification"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verificationToken"}}]}}]}}]} as unknown as DocumentNode<StartVerificationMutation, StartVerificationMutationVariables>;
export const UpdateDevTeamByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateDevTeamById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"patch"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DevTeamPatch"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateDevTeamById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"patch"},"value":{"kind":"Variable","name":{"kind":"Name","value":"patch"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"devTeam"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"handle"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateDevTeamByIdMutation, UpdateDevTeamByIdMutationVariables>;
export const UpdateGameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateGame"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateGameInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateGame"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"game"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateGameMutation, UpdateGameMutationVariables>;
export const UpdateGameSdkDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateGameSdk"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateGameSdkInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateGameSdk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"error"}}]}}]}}]} as unknown as DocumentNode<UpdateGameSdkMutation, UpdateGameSdkMutationVariables>;