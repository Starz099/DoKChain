use anchor_lang::prelude::*;

declare_id!("2w46rNJi14Wf5nysxbWfj8EqNgevjaBPwqTNasuUqGb4");

#[program]
pub mod document_verification {
    use super::*;

    // Initialize a new organization
    pub fn create_organization(
        ctx: Context<CreateOrganization>,
        org_name: String,
        org_description: String,
    ) -> Result<()> {
        require!(
            !org_name.is_empty() && org_name.len() <= 100,
            DocumentError::InvalidOrgName
        );
        require!(
            org_description.len() <= 500,
            DocumentError::InvalidDescription
        );

        let org = &mut ctx.accounts.organization;
        org.org_authority = ctx.accounts.authority.key();
        org.org_name = org_name;
        org.org_description = org_description;
        org.created_at = Clock::get()?.unix_timestamp;
        org.document_count = 0;

        emit!(OrganizationCreated {
            org_authority: org.org_authority,
            org_name: org.org_name.clone(),
        });

        Ok(())
    }

    // Organization uploads a document for a user
    pub fn upload_document(
        ctx: Context<UploadDocument>,
        user_address: Pubkey,
        ipfs_hash: String,
        document_type: String,
        document_name: String,
    ) -> Result<()> {
        require!(
            ctx.accounts.organization.org_authority == ctx.accounts.authority.key(),
            DocumentError::Unauthorized
        );
        require!(
            !ipfs_hash.is_empty() && ipfs_hash.len() <= 100,
            DocumentError::InvalidIPFSHash
        );
        require!(
            !document_type.is_empty() && document_type.len() <= 50,
            DocumentError::InvalidDocumentType
        );
        require!(
            !document_name.is_empty() && document_name.len() <= 100,
            DocumentError::InvalidDocumentName
        );

        let document = &mut ctx.accounts.document;
        document.organization = ctx.accounts.organization.key();
        document.user = user_address;
        document.ipfs_hash = ipfs_hash.clone();
        document.document_type = document_type;
        document.document_name = document_name;
        document.uploaded_at = Clock::get()?.unix_timestamp;
        document.is_revoked = false;

        ctx.accounts.organization.document_count = ctx.accounts.organization.document_count.checked_add(1)
            .ok_or(DocumentError::DocumentCountOverflow)?;

        emit!(DocumentUploaded {
            organization: ctx.accounts.organization.key(),
            user: user_address,
            ipfs_hash: document.ipfs_hash.clone(),
            document_type: document.document_type.clone(),
        });

        Ok(())
    }

    // User fetches their own documents
    pub fn get_user_documents(ctx: Context<GetUserDocuments>) -> Result<()> {
        require!(
            ctx.accounts.user_account.user_address == ctx.accounts.user.key(),
            DocumentError::Unauthorized
        );

        Ok(())
    }

    // Organization revokes a document
    pub fn revoke_document(ctx: Context<RevokeDocument>) -> Result<()> {
        require!(
            ctx.accounts.organization.org_authority == ctx.accounts.authority.key(),
            DocumentError::Unauthorized
        );
        require!(
            !ctx.accounts.document.is_revoked,
            DocumentError::DocumentAlreadyRevoked
        );

        let document = &mut ctx.accounts.document;
        document.is_revoked = true;
        document.revoked_at = Some(Clock::get()?.unix_timestamp);

        emit!(DocumentRevoked {
            organization: ctx.accounts.organization.key(),
            user: document.user,
            ipfs_hash: document.ipfs_hash.clone(),
        });

        Ok(())
    }

    // User initializes their profile
    pub fn initialize_user(ctx: Context<InitializeUser>) -> Result<()> {
        let user_account = &mut ctx.accounts.user_account;
        user_account.user_address = ctx.accounts.user.key();
        user_account.created_at = Clock::get()?.unix_timestamp;
        user_account.total_documents = 0;

        emit!(UserInitialized {
            user: ctx.accounts.user.key(),
        });

        Ok(())
    }

    // User revokes access to their own document
    pub fn user_revoke_access(ctx: Context<UserRevokeAccess>) -> Result<()> {
        require!(
            ctx.accounts.document.user == ctx.accounts.user.key(),
            DocumentError::Unauthorized
        );
        require!(
            !ctx.accounts.document.is_revoked,
            DocumentError::DocumentAlreadyRevoked
        );

        let document = &mut ctx.accounts.document;
        document.is_revoked = true;
        document.revoked_at = Some(Clock::get()?.unix_timestamp);

        emit!(UserRevokedAccess {
            user: ctx.accounts.user.key(),
            ipfs_hash: document.ipfs_hash.clone(),
        });

        Ok(())
    }

    // Get organization details
    pub fn get_organization(ctx: Context<GetOrganization>) -> Result<()> {
        let _org = &ctx.accounts.organization;
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(org_name: String, org_description: String)]
pub struct CreateOrganization<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + std::mem::size_of::<Organization>() + org_name.len() + org_description.len() + 100,
        seeds = [b"organization", authority.key().as_ref()],
        bump
    )]
    pub organization: Account<'info, Organization>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(user_address: Pubkey, ipfs_hash: String, document_type: String, document_name: String)]
pub struct UploadDocument<'info> {
    #[account(mut)]
    pub organization: Account<'info, Organization>,

    #[account(
        init,
        payer = authority,
        space = 8 + std::mem::size_of::<Document>() + ipfs_hash.len() + document_type.len() + document_name.len() + 100,
        seeds = [b"document", organization.key().as_ref(), user_address.as_ref(), ipfs_hash.as_bytes()],
        bump
    )]
    pub document: Account<'info, Document>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct GetUserDocuments<'info> {
    pub organization: Account<'info, Organization>,
    pub document: Account<'info, Document>,

    #[account(
        constraint = user_account.user_address == user.key()
    )]
    pub user_account: Account<'info, UserAccount>,

    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct RevokeDocument<'info> {
    #[account(mut)]
    pub organization: Account<'info, Organization>,

    #[account(mut)]
    pub document: Account<'info, Document>,

    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct InitializeUser<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + std::mem::size_of::<UserAccount>() + 100,
        seeds = [b"user", user.key().as_ref()],
        bump
    )]
    pub user_account: Account<'info, UserAccount>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UserRevokeAccess<'info> {
    #[account(mut)]
    pub document: Account<'info, Document>,

    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct GetOrganization<'info> {
    pub organization: Account<'info, Organization>,
}

#[account]
pub struct Organization {
    pub org_authority: Pubkey,
    pub org_name: String,
    pub org_description: String,
    pub created_at: i64,
    pub document_count: u64,
}

#[account]
pub struct Document {
    pub organization: Pubkey,
    pub user: Pubkey,
    pub ipfs_hash: String,
    pub document_type: String,
    pub document_name: String,
    pub uploaded_at: i64,
    pub is_revoked: bool,
    pub revoked_at: Option<i64>,
}

#[account]
pub struct UserAccount {
    pub user_address: Pubkey,
    pub created_at: i64,
    pub total_documents: u64,
}

#[event]
pub struct OrganizationCreated {
    pub org_authority: Pubkey,
    pub org_name: String,
}

#[event]
pub struct DocumentUploaded {
    pub organization: Pubkey,
    pub user: Pubkey,
    pub ipfs_hash: String,
    pub document_type: String,
}

#[event]
pub struct DocumentRevoked {
    pub organization: Pubkey,
    pub user: Pubkey,
    pub ipfs_hash: String,
}

#[event]
pub struct UserInitialized {
    pub user: Pubkey,
}

#[event]
pub struct UserRevokedAccess {
    pub user: Pubkey,
    pub ipfs_hash: String,
}

#[error_code]
pub enum DocumentError {
    #[msg("Unauthorized access")]
    Unauthorized,
    #[msg("Invalid organization name")]
    InvalidOrgName,
    #[msg("Invalid organization description")]
    InvalidDescription,
    #[msg("Invalid IPFS hash")]
    InvalidIPFSHash,
    #[msg("Invalid document type")]
    InvalidDocumentType,
    #[msg("Invalid document name")]
    InvalidDocumentName,
    #[msg("Document already revoked")]
    DocumentAlreadyRevoked,
    #[msg("Document count overflow")]
    DocumentCountOverflow,
}