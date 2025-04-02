import Oas from 'oas';
import APICore from 'api/dist/core';
import definition from './openapi.json';
class SDK {
    constructor() {
        this.spec = Oas.init(definition);
        this.core = new APICore(this.spec, 'waapi/v1.6.0 (api/6.1.3)');
    }
    /**
     * Optionally configure various options that the SDK allows.
     *
     * @param config Object of supported SDK options and toggles.
     * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
     * should be represented in milliseconds.
     */
    config(config) {
        this.core.setConfig(config);
    }
    /**
     * If the API you're using requires authentication you can supply the required credentials
     * through this method and the library will magically determine how they should be used
     * within your API request.
     *
     * With the exception of OpenID and MutualTLS, it supports all forms of authentication
     * supported by the OpenAPI specification.
     *
     * @example <caption>HTTP Basic auth</caption>
     * sdk.auth('username', 'password');
     *
     * @example <caption>Bearer tokens (HTTP or OAuth 2)</caption>
     * sdk.auth('myBearerToken');
     *
     * @example <caption>API Keys</caption>
     * sdk.auth('myApiKey');
     *
     * @see {@link https://spec.openapis.org/oas/v3.0.3#fixed-fields-22}
     * @see {@link https://spec.openapis.org/oas/v3.1.0#fixed-fields-22}
     * @param values Your auth credentials for the API; can specify up to two strings or numbers.
     */
    auth(...values) {
        this.core.setAuth(...values);
        return this;
    }
    /**
     * If the API you're using offers alternate server URLs, and server variables, you can tell
     * the SDK which one to use with this method. To use it you can supply either one of the
     * server URLs that are contained within the OpenAPI definition (along with any server
     * variables), or you can pass it a fully qualified URL to use (that may or may not exist
     * within the OpenAPI definition).
     *
     * @example <caption>Server URL with server variables</caption>
     * sdk.server('https://{region}.api.example.com/{basePath}', {
     *   name: 'eu',
     *   basePath: 'v14',
     * });
     *
     * @example <caption>Fully qualified server URL</caption>
     * sdk.server('https://eu.api.example.com/v14');
     *
     * @param url Server URL
     * @param variables An object of variables to replace into the server URL.
     */
    server(url, variables = {}) {
        this.core.setServer(url, variables);
    }
    /**
     * Retrieve a list of your instances.
     *
     * @summary list instances
     */
    getInstances(metadata) {
        return this.core.fetch('/instances', 'get', metadata);
    }
    /**
     * Create a new instance
     *
     * @summary create instance
     */
    postInstances() {
        return this.core.fetch('/instances', 'post');
    }
    /**
     * Retrieve a single instance by its ID
     *
     * @summary retrieve instance
     */
    getInstancesId(metadata) {
        return this.core.fetch('/instances/{id}', 'get', metadata);
    }
    /**
     * Update the instance.
     *
     * @summary update instance
     */
    putInstancesId(body, metadata) {
        return this.core.fetch('/instances/{id}', 'put', body, metadata);
    }
    /**
     * delete an instance by ID
     *
     * @summary delete instance
     */
    deleteInstancesId(metadata) {
        return this.core.fetch('/instances/{id}', 'delete', metadata);
    }
    /**
     * retrieve the status of your running client
     *
     * @summary client status of instance
     */
    getInstancesIdClientStatus(metadata) {
        return this.core.fetch('/instances/{id}/client/status', 'get', metadata);
    }
    /**
     * Retrieves a base64 encoded QR code image that can be used to authenticate and connect a
     * WhatsApp account to this instance. The QR code should be scanned using the WhatsApp
     * mobile app to complete authentication.
     *
     * @summary retrieve QR Code
     */
    getInstancesIdClientQr(metadata) {
        return this.core.fetch('/instances/{id}/client/qr', 'get', metadata);
    }
    /**
     * retrieve general information of the whatsapp user conntected to your instance
     *
     * @summary retrieve basic client information
     */
    getInstancesIdClientMe(metadata) {
        return this.core.fetch('/instances/{id}/client/me', 'get', metadata);
    }
    /**
     * Send a text message to a chat. The chatId format varies depending on the chat type:
     * - Individual chat: {phone_number}@c.us (e.g. 491234567890@c.us)
     * - Group chat: {group_id}@g.us (e.g. 123456789-123456789@g.us)
     * - Channel/Newsletter: {channel_id}@newsletter (e.g. 123456789@newsletter)
     *
     * @summary Send a text message to a chat
     */
    postInstancesIdClientActionSendMessage(body, metadata) {
        return this.core.fetch('/instances/{id}/client/action/send-message', 'post', body, metadata);
    }
    /**
     * Send a media message (image, video, audio, document) to a chat. The chatId format varies
     * depending on the chat type:
     * - Individual chat: {phone_number}@c.us (e.g. 123456789@c.us)
     * - Group chat: {group_id}@g.us (e.g. 123456789-123456789@g.us)
     * - Channel/Newsletter: {channel_id}@newsletter (e.g. 123456789@newsletter)
     *
     * Supported media types:
     * - Images: jpg, jpeg, png, gif
     * - Videos: mp4, 3gp, mov
     * - Audio: mp3, wav, ogg, m4a
     * - Documents: pdf, doc, docx, txt, xlsx, etc
     *
     * @summary Send a media message (image, video, audio, document)
     */
    postInstancesIdClientActionSendMedia(body, metadata) {
        return this.core.fetch('/instances/{id}/client/action/send-media', 'post', body, metadata);
    }
    /**
     * Mark all messages in a chat as seen (read). This will show blue ticks (double check
     * marks) to the sender only if both parties have read receipts enabled in their WhatsApp
     * privacy settings. If read receipts are disabled by either party, the messages will be
     * marked as delivered (gray ticks) instead.
     *
     * @summary Mark chat messages as seen (blue ticks)
     */
    postInstancesIdClientActionSendSeen(body, metadata) {
        return this.core.fetch('/instances/{id}/client/action/send-seen', 'post', body, metadata);
    }
    /**
     * Send a vCard to a contact or group.
     *
     * @summary Send vCard
     */
    postInstancesIdClientActionSendVcard(body, metadata) {
        return this.core.fetch('/instances/{id}/client/action/send-vcard', 'post', body, metadata);
    }
    /**
     * Send a location message to a contact or group chat. The location can include additional
     * details like name, address and URL.
     *
     * @summary Send Location
     */
    postInstancesIdClientActionSendLocation(body, metadata) {
        return this.core.fetch('/instances/{id}/client/action/send-location', 'post', body, metadata);
    }
    /**
     * Retrieves a list of all chats with their latest messages and metadata. Supports
     * pagination.
     *
     * @summary Get all chats
     */
    postInstancesIdClientActionGetChats(body, metadata) {
        return this.core.fetch('/instances/{id}/client/action/get-chats', 'post', body, metadata);
    }
    /**
     * Marks a specified chat conversation as unread. This is useful for flagging important
     * conversations for later attention.
     *
     * @summary Mark Chat as Unread
     */
    postInstancesIdClientActionMarkChatUnread(body, metadata) {
        return this.core.fetch('/instances/{id}/client/action/mark-chat-unread', 'post', body, metadata);
    }
    /**
     * Mute notifications for a specific chat either indefinitely or until a specified date
     *
     * @summary Mute Chat
     */
    postInstancesIdClientActionMuteChat(body, metadata) {
        return this.core.fetch('/instances/{id}/client/action/mute-chat', 'post', body, metadata);
    }
    /**
     * Removes mute settings from a specified chat, allowing notifications to be received
     * again.
     *
     * @summary Unmute Chat
     */
    postInstancesIdClientActionUnmuteChat(body, metadata) {
        return this.core.fetch('/instances/{id}/client/action/unmute-chat', 'post', body, metadata);
    }
    /**
     * Pins a chat to the top of the chat list. The operation may fail if the maximum number of
     * pinned chats (3) has been reached.
     *
     * @summary Pin Chat
     */
    postInstancesIdClientActionPinChat(body, metadata) {
        return this.core.fetch('/instances/{id}/client/action/pin-chat', 'post', body, metadata);
    }
    /**
     * Removes a chat from pinned status. This endpoint allows you to unpin a previously pinned
     * chat conversation.
     *
     * @summary Unpin Chat
     */
    postInstancesIdClientActionUnpinChat(body, metadata) {
        return this.core.fetch('/instances/{id}/client/action/unpin-chat', 'post', body, metadata);
    }
    /**
     * Retrieve messages from a specific chat with optional filtering and media inclusion
     *
     * @summary Fetch messages from a chat
     */
    postInstancesIdClientActionFetchMessages(body, metadata) {
        return this.core.fetch('/instances/{id}/client/action/fetch-messages', 'post', body, metadata);
    }
    /**
     * Retrieve a specific message using its unique identifier. Optionally includes the media
     * content if requested.
     *
     * @summary Get Message by ID
     */
    postInstancesIdClientActionGetMessageById(body, metadata) {
        return this.core.fetch('/instances/{id}/client/action/get-message-by-id', 'post', body, metadata);
    }
    /**
     * get a message info by id
     *
     * @summary get message info by id
     */
    postInstancesIdClientActionGetMessageInfoById(body, metadata) {
        return this.core.fetch('/instances/{id}/client/action/get-message-info-by-id', 'post', body, metadata);
    }
    /**
     * delete a message by id
     *
     * @summary delete message by id
     */
    postInstancesIdClientActionDeleteMessageById(body, metadata) {
        return this.core.fetch('/instances/{id}/client/action/delete-message-by-id', 'post', body, metadata);
    }
    /**
     * Search for messages across all chats or within a specific chat. Returns paginated
     * results with message details.
     *
     * @summary Search Messages
     */
    postInstancesIdClientActionSearchMessages(body, metadata) {
        return this.core.fetch('/instances/{id}/client/action/search-messages', 'post', body, metadata);
    }
    /**
     * Retrieves a list of all contacts from the WhatsApp account, including saved contacts and
     * WhatsApp users who have messaged you.
     *
     * @summary Get all WhatsApp contacts
     */
    postInstancesIdClientActionGetContacts(metadata) {
        return this.core.fetch('/instances/{id}/client/action/get-contacts', 'post', metadata);
    }
    /**
     * Converts a phone number into the proper WhatsApp chat ID format. This is especially
     * useful for countries that don't follow the standard chat ID format (like Brazil, Mexico
     * and Argentina). The endpoint ensures you get the correct chat ID for any phone number.
     *
     * @summary Get WhatsApp chat ID from phone number
     */
    postInstancesIdClientActionGetNumberId(body, metadata) {
        return this.core.fetch('/instances/{id}/client/action/get-number-id', 'post', body, metadata);
    }
    /**
     * Get the country code for a given phone number
     *
     * @summary get country code
     */
    postInstancesIdClientActionGetCountryCode(body, metadata) {
        return this.core.fetch('/instances/{id}/client/action/get-country-code', 'post', body, metadata);
    }
    /**
     * Format a phone number into standardized format
     *
     * @summary get formatted number
     */
    postInstancesIdClientActionGetFormattedNumber(body, metadata) {
        return this.core.fetch('/instances/{id}/client/action/get-formatted-number', 'post', body, metadata);
    }
    /**
     * Check if a given contactId is registered.
     *
     * @summary is registered user
     */
    postInstancesIdClientActionIsRegisteredUser(body, metadata) {
        return this.core.fetch('/instances/{id}/client/action/is-registered-user', 'post', body, metadata);
    }
    /**
     * Creates and sends an interactive poll message to a specified chat. The poll can have
     * between 2-12 options and optionally allow multiple selections.
     *
     * @summary Create Poll Message
     */
    postInstancesIdClientActionCreatePoll(body, metadata) {
        return this.core.fetch('/instances/{id}/client/action/create-poll', 'post', body, metadata);
    }
    /**
     * Retrieves all available WhatsApp stories/status updates that are visible to the
     * authenticated user. This includes both viewed and unviewed stories from contacts.
     *
     * @summary Get WhatsApp Stories
     */
    postInstancesIdClientActionGetStories(metadata) {
        return this.core.fetch('/instances/{id}/client/action/get-stories', 'post', metadata);
    }
    /**
     * Retrieves the profile picture URL for a contact, chat, group, or newsletter. Access is
     * subject to privacy settings. Use appropriate suffixes: @c.us for contacts/chats, @g.us
     * for groups, @newsletter for newsletters.
     *
     * @summary Get Profile Picture URL
     */
    postInstancesIdClientActionGetProfilePicUrl(body, metadata) {
        return this.core.fetch('/instances/{id}/client/action/get-profile-pic-url', 'post', body, metadata);
    }
    /**
     * Retrieves detailed contact information for a specific WhatsApp contact using their ID.
     * Returns contact details including name, number, business status, and various contact
     * flags.
     *
     * @summary Get Contact Details by ID
     */
    postInstancesIdClientActionGetContactById(body, metadata) {
        return this.core.fetch('/instances/{id}/client/action/get-contact-by-id', 'post', body, metadata);
    }
    /**
     * Blocks a WhatsApp contact, preventing them from sending messages to the authenticated
     * user. The contact will not be able to see the user's last seen, online status, or status
     * updates.
     *
     * @summary Block a WhatsApp Contact
     */
    postInstancesIdClientActionBlockContact(body, metadata) {
        return this.core.fetch('/instances/{id}/client/action/block-contact', 'post', body, metadata);
    }
    /**
     * Removes a contact from the blocked contacts list, allowing them to send messages and see
     * your information again according to your privacy settings.
     *
     * @summary Unblock a WhatsApp Contact
     */
    postInstancesIdClientActionUnblockContact(body, metadata) {
        return this.core.fetch('/instances/{id}/client/action/unblock-contact', 'post', body, metadata);
    }
    /**
     * Retrieves a list of all blocked contacts
     *
     * @summary Get blocked contacts
     */
    postInstancesIdClientActionGetBlockedContacts(metadata) {
        return this.core.fetch('/instances/{id}/client/action/get-blocked-contacts', 'post', metadata);
    }
    /**
     * Get list of groups that are in common between you and the specified contact
     *
     * @summary Get common groups with contact
     */
    postInstancesIdClientActionGetCommonGroups(body, metadata) {
        return this.core.fetch('/instances/{id}/client/action/get-common-groups', 'post', body, metadata);
    }
    /**
     * Retrieves the about/status info for a specific contact
     *
     * @summary Get contact about info
     */
    postInstancesIdClientActionGetContactAboutInfo(body, metadata) {
        return this.core.fetch('/instances/{id}/client/action/get-contact-about-info', 'post', body, metadata);
    }
    /**
     * Get chat by ID
     *
     * @summary get chat by id
     */
    postInstancesIdClientActionGetChatById(body, metadata) {
        return this.core.fetch('/instances/{id}/client/action/get-chat-by-id', 'post', body, metadata);
    }
    /**
     * Delete chat by ID
     *
     * @summary delete chat by id
     */
    postInstancesIdClientActionDeleteChatById(body, metadata) {
        return this.core.fetch('/instances/{id}/client/action/delete-chat-by-id', 'post', body, metadata);
    }
    /**
     * Creates a new WhatsApp group with specified name and participants
     *
     * @summary Create Group
     */
    postInstancesIdClientActionCreateGroup(body, metadata) {
        return this.core.fetch('/instances/{id}/client/action/create-group', 'post', body, metadata);
    }
    /**
     * Get group participants
     *
     * @summary get group participants
     */
    postInstancesIdClientActionGetGroupParticipants(body, metadata) {
        return this.core.fetch('/instances/{id}/client/action/get-group-participants', 'post', body, metadata);
    }
    /**
     * Get group info
     *
     * @summary get group info
     */
    postInstancesIdClientActionGetGroupInfo(body, metadata) {
        return this.core.fetch('/instances/{id}/client/action/get-group-info', 'post', body, metadata);
    }
    /**
     * Get reactions for a specific message
     *
     * @summary get message reactions
     */
    postInstancesIdClientActionGetReactions(body, metadata) {
        return this.core.fetch('/instances/{id}/client/action/get-reactions', 'post', body, metadata);
    }
    /**
     * Add or remove a reaction emoji to/from a message
     *
     * @summary react to message
     */
    postInstancesIdClientActionReactToMessage(body, metadata) {
        return this.core.fetch('/instances/{id}/client/action/react-to-message', 'post', body, metadata);
    }
    /**
     * Update Group Information
     *
     * @summary update group info
     */
    postInstancesIdClientActionUpdateGroupInfo(body, metadata) {
        return this.core.fetch('/instances/{id}/client/action/update-group-info', 'post', body, metadata);
    }
    /**
     * Get mentions from a message
     *
     * @summary get message mentions
     */
    postInstancesIdClientActionGetMessageMentions(body, metadata) {
        return this.core.fetch('/instances/{id}/client/action/get-message-mentions', 'post', body, metadata);
    }
    /**
     * Pin a message in a chat
     *
     * @summary pin message
     */
    postInstancesIdClientActionPinMessage(body, metadata) {
        return this.core.fetch('/instances/{id}/client/action/pin-message', 'post', body, metadata);
    }
    /**
     * Unpin a message in a chat
     *
     * @summary unpin message
     */
    postInstancesIdClientActionUnpinMessage(body, metadata) {
        return this.core.fetch('/instances/{id}/client/action/unpin-message', 'post', body, metadata);
    }
    /**
     * Star a message by its ID
     *
     * @summary star message
     */
    postInstancesIdClientActionStarMessage(body, metadata) {
        return this.core.fetch('/instances/{id}/client/action/star-message', 'post', body, metadata);
    }
    /**
     * Remove star from a message
     *
     * @summary unstar message
     */
    postInstancesIdClientActionUnstarMessage(body, metadata) {
        return this.core.fetch('/instances/{id}/client/action/unstar-message', 'post', body, metadata);
    }
    /**
     * Update Group Settings
     *
     * @summary update group settings
     */
    postInstancesIdClientActionUpdateGroupSettings(body, metadata) {
        return this.core.fetch('/instances/{id}/client/action/update-group-settings', 'post', body, metadata);
    }
    /**
     * Add a participant to a group
     *
     * @summary add group participant
     */
    postInstancesIdClientActionAddGroupParticipant(body, metadata) {
        return this.core.fetch('/instances/{id}/client/action/add-group-participant', 'post', body, metadata);
    }
    /**
     * Remove a participant from a group
     *
     * @summary remove group participant
     */
    postInstancesIdClientActionRemoveGroupParticipant(body, metadata) {
        return this.core.fetch('/instances/{id}/client/action/remove-group-participant', 'post', body, metadata);
    }
    /**
     * Promote a participant to admin
     *
     * @summary promote group participant
     */
    postInstancesIdClientActionPromoteGroupParticipant(body, metadata) {
        return this.core.fetch('/instances/{id}/client/action/promote-group-participant', 'post', body, metadata);
    }
    /**
     * Demote a participant from admin to normal participant
     *
     * @summary demote group participant
     */
    postInstancesIdClientActionDemoteGroupParticipant(body, metadata) {
        return this.core.fetch('/instances/{id}/client/action/demote-group-participant', 'post', body, metadata);
    }
    /**
     * Approve pending group membership requests
     *
     * @summary approve group membership requests
     */
    postInstancesIdClientActionAcceptGroupMemberRequests(body, metadata) {
        return this.core.fetch('/instances/{id}/client/action/accept-group-member-requests', 'post', body, metadata);
    }
    /**
     * Deny pending group membership requests
     *
     * @summary deny group membership requests
     */
    postInstancesIdClientActionDenyGroupMemberRequests(body, metadata) {
        return this.core.fetch('/instances/{id}/client/action/deny-group-member-requests', 'post', body, metadata);
    }
    /**
     * Get pending group membership requests
     *
     * @summary get group membership requests
     */
    postInstancesIdClientActionGetGroupMemberRequests(body, metadata) {
        return this.core.fetch('/instances/{id}/client/action/get-group-member-requests', 'post', body, metadata);
    }
    /**
     * Accept a WhatsApp group invite using an invite code
     *
     * @summary accept group invite
     */
    postInstancesIdClientActionAcceptInvite(body, metadata) {
        return this.core.fetch('/instances/{id}/client/action/accept-invite', 'post', body, metadata);
    }
    /**
     * Get information about a group invite code
     *
     * @summary get group invite info
     */
    postInstancesIdClientActionGetInviteInfo(body, metadata) {
        return this.core.fetch('/instances/{id}/client/action/get-invite-info', 'post', body, metadata);
    }
    /**
     * Create a channel
     *
     * @summary create a channel
     */
    postInstancesIdClientActionCreateChannel(body, metadata) {
        return this.core.fetch('/instances/{id}/client/action/create-channel', 'post', body, metadata);
    }
    /**
     * get your channels
     *
     * @summary get channels
     */
    postInstancesIdClientActionGetChannels(metadata) {
        return this.core.fetch('/instances/{id}/client/action/get-channels', 'post', metadata);
    }
    /**
     * get channel by id
     *
     * @summary get channel by id
     */
    postInstancesIdClientActionGetChannelById(body, metadata) {
        return this.core.fetch('/instances/{id}/client/action/get-channel-by-id', 'post', body, metadata);
    }
    /**
     * subscribe to channel
     *
     * @summary subscribe to channel
     */
    postInstancesIdClientActionSubscribeToChannel(body, metadata) {
        return this.core.fetch('/instances/{id}/client/action/subscribe-to-channel', 'post', body, metadata);
    }
    /**
     * unsubscribe from channel
     *
     * @summary unsubscribe from channel
     */
    postInstancesIdClientActionUnsubscribeFromChannel(body, metadata) {
        return this.core.fetch('/instances/{id}/client/action/unsubscribe-from-channel', 'post', body, metadata);
    }
    /**
     * Search for WhatsApp channels
     *
     * @summary search channels
     */
    postInstancesIdClientActionSearchChannels(body, metadata) {
        return this.core.fetch('/instances/{id}/client/action/search-channels', 'post', body, metadata);
    }
    /**
     * archive chat
     *
     * @summary archive chat
     */
    postInstancesIdClientActionArchiveChat(body, metadata) {
        return this.core.fetch('/instances/{id}/client/action/archive-chat', 'post', body, metadata);
    }
    /**
     * unarchive chat
     *
     * @summary unarchive chat
     */
    postInstancesIdClientActionUnarchiveChat(body, metadata) {
        return this.core.fetch('/instances/{id}/client/action/unarchive-chat', 'post', body, metadata);
    }
    /**
     * get all labels
     *
     */
    postInstancesIdClientActionGetLabels(metadata) {
        return this.core.fetch('/instances/{id}/client/action/get-labels', 'post', metadata);
    }
    /**
     * Get label by ID
     *
     * @summary get label by id
     */
    postInstancesIdClientActionGetLabelById(body, metadata) {
        return this.core.fetch('/instances/{id}/client/action/get-label-by-id', 'post', body, metadata);
    }
    /**
     * Get chat labels by chat ID
     *
     * @summary get chat labels
     */
    postInstancesIdClientActionGetChatLabels(body, metadata) {
        return this.core.fetch('/instances/{id}/client/action/get-chat-labels', 'post', body, metadata);
    }
    /**
     * Get chats by label ID
     *
     * @summary get chats by labelId
     */
    postInstancesIdClientActionGetChatsByLabelId(body, metadata) {
        return this.core.fetch('/instances/{id}/client/action/get-chats-by-label-id', 'post', body, metadata);
    }
    /**
     * Logs out the client, closing the current session
     *
     * @summary logout
     */
    postInstancesIdClientActionLogout(metadata) {
        return this.core.fetch('/instances/{id}/client/action/logout', 'post', metadata);
    }
    /**
     * Reboots your WhatsApp instance. This will close the current session and restart the
     * client. The instance will need to be re-authenticated if it was previously logged in.
     *
     * @summary Reboot Instance
     */
    postInstancesIdClientActionReboot(metadata) {
        return this.core.fetch('/instances/{id}/client/action/reboot', 'post', metadata);
    }
    /**
     * Sets the client's presence status to 'available'/'online'
     *
     * @summary Send presence available
     */
    postInstancesIdClientActionSendPresenceAvailable(metadata) {
        return this.core.fetch('/instances/{id}/client/action/send-presence-available', 'post', metadata);
    }
    /**
     * Sets the WhatsApp status text for the connected account
     *
     * @summary Set WhatsApp status
     */
    postInstancesIdClientActionSetStatus(body, metadata) {
        return this.core.fetch('/instances/{id}/client/action/set-status', 'post', body, metadata);
    }
    /**
     * Sets the display name for the WhatsApp account
     *
     * @summary Set display name
     */
    postInstancesIdClientActionSetDisplayName(body, metadata) {
        return this.core.fetch('/instances/{id}/client/action/set-display-name', 'post', body, metadata);
    }
    /**
     * Request a WhatsApp pairing code for phone number registration. To prevent abuse and
     * ensure system stability, pairing code requests are limited to 2 per minute. Multiple
     * rapid requests may indicate automated abuse attempts to Whatsapp.
     *
     * @summary Request Pairing Code
     */
    postInstancesIdClientActionRequestPairingCode(body, metadata) {
        return this.core.fetch('/instances/{id}/client/action/request-pairing-code', 'post', body, metadata);
    }
    /**
     * Sends typing state indicator to a chat
     *
     * @summary Send typing state
     */
    postInstancesIdClientActionSendTyping(body, metadata) {
        return this.core.fetch('/instances/{id}/client/action/send-typing', 'post', body, metadata);
    }
    /**
     * Clears all messages from a specific chat
     *
     * @summary Clear chat messages
     */
    postInstancesIdClientActionClearChatMessages(body, metadata) {
        return this.core.fetch('/instances/{id}/client/action/clear-chat-messages', 'post', body, metadata);
    }
    /**
     * Synchronizes the chat history for a specific chat
     *
     * @summary Sync chat history
     */
    postInstancesIdClientActionSyncChatHistory(body, metadata) {
        return this.core.fetch('/instances/{id}/client/action/sync-chat-history', 'post', body, metadata);
    }
    /**
     * Stops the typing indicator for a chat
     *
     * @summary Stop typing indicator
     */
    postInstancesIdClientActionSendStopTyping(body, metadata) {
        return this.core.fetch('/instances/{id}/client/action/send-stop-typing', 'post', body, metadata);
    }
    /**
     * Sets the client's presence status to 'unavailable'/'offline'
     *
     * @summary Send presence unavailable
     */
    postInstancesIdClientActionSendPresenceUnavailable(metadata) {
        return this.core.fetch('/instances/{id}/client/action/send-presence-unavailable', 'post', metadata);
    }
}
const createSDK = (() => { return new SDK(); })();
export default createSDK;
