import Invoice from '../models/Invoice';
import Project from '../models/Project';
import User from '../models/User';
import SystemSettings from '../models/SystemSettings';
import mongoose from 'mongoose';

export class InvoiceService {
    /**
     * Generates a Platform Invoice (RAVE Fee + GST)
     * To be called when Brand funds the project/deal.
     */
    static async generatePlatformInvoice(projectId: string) {
        const project = await Project.findById(projectId).populate('vendor creator campaign');
        if (!project) throw new Error('Project not found');

        const settings = await SystemSettings.findOne() || { commissionRate: 0.20 };
        
        // Calculate fields if not already set (re-verifying)
        const dealAmount = project.dealAmount;
        const platformFee = dealAmount * settings.commissionRate;
        const taxAmount = platformFee * 0.18; // 18% GST on fee
        const totalPayable = dealAmount + taxAmount;

        const count = await Invoice.countDocuments({ type: 'PLATFORM' });
        const invoiceNumber = `RAVE-INV-${(count + 1).toString().padStart(4, '0')}`;

        const invoice = await Invoice.create({
            invoiceNumber,
            type: 'PLATFORM',
            projectId: project._id,
            payerId: project.vendor,
            payeeId: new mongoose.Types.ObjectId(), // RAVE itself (internal placeholder or admin)
            amount: dealAmount,
            taxAmount: taxAmount,
            totalAmount: totalPayable,
            description: `Campaign Collaboration: ${(project.campaign as any)?.title || 'Service'}`,
            metadata: {
                campaignTitle: (project.campaign as any)?.title,
                brandName: (project.vendor as any)?.name,
                raveHeadName: (project.creator as any)?.name,
            },
            status: 'GENERATED'
        });

        return invoice;
    }

    /**
     * Generates a CREATOR Invoice (Net Payout)
     * To be called when Payment is RELEASED to Rave Head.
     */
    static async generateCreatorInvoice(projectId: string) {
        const project = await Project.findById(projectId).populate('vendor creator');
        if (!project) throw new Error('Project not found');

        if (project.paymentStatus !== 'RELEASED') {
            throw new Error('Creator invoice can only be generated after payment release');
        }

        const count = await Invoice.countDocuments({ type: 'CREATOR' });
        const creatorHandle = (project.creator as any)?.username?.toUpperCase() || 'USR';
        const invoiceNumber = `RH-${creatorHandle}-${(count + 1).toString().padStart(4, '0')}`;

        const invoice = await Invoice.create({
            invoiceNumber,
            type: 'CREATOR',
            projectId: project._id,
            payerId: project.vendor, // Brand is still the "Entity" being served
            payeeId: project.creator,
            amount: project.netAmount,
            taxAmount: 0, // Assuming individual creators don't charge GST unless specified (v1)
            totalAmount: project.netAmount,
            description: `Service Delivery for Project: ${project._id}`,
            metadata: {
                brandName: (project.vendor as any)?.name,
                raveHeadName: (project.creator as any)?.name,
            },
            status: 'GENERATED'
        });

        return invoice;
    }
}
