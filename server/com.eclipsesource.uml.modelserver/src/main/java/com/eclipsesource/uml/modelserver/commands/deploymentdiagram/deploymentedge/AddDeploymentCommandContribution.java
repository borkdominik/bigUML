package com.eclipsesource.uml.modelserver.commands.deploymentdiagram.deploymentedge;

import com.eclipsesource.uml.modelserver.commands.commons.contributions.UmlCompoundCommandContribution;
import org.eclipse.emf.common.command.CompoundCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.command.CCommandFactory;
import org.eclipse.emfcloud.modelserver.command.CCompoundCommand;
import org.eclipse.emfcloud.modelserver.common.codecs.DecodingException;

public class AddDeploymentCommandContribution extends UmlCompoundCommandContribution {

    public static final String TYPE = "addDeploymentContributuion";
    public static final String SOURCE_NODE_URI_FRAGMENT = "sourceNodeUriFragment";
    public static final String TARGET_NODE_URI_FRAGMENT = "targetNodeUriFragment";

    public static CCompoundCommand create(final String sourceNodeUriFragment, final String targetNodeUriFragment) {
        CCompoundCommand addCommandContributionCommand = CCommandFactory.eINSTANCE.createCompoundCommand();
        addCommandContributionCommand.setType(TYPE);
        addCommandContributionCommand.getProperties().put(SOURCE_NODE_URI_FRAGMENT, sourceNodeUriFragment);
        addCommandContributionCommand.getProperties().put(TARGET_NODE_URI_FRAGMENT, targetNodeUriFragment);
        return addCommandContributionCommand;
    }

    @Override
    protected CompoundCommand toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
            throws DecodingException {

        String sourceClassUriFragment = command.getProperties().get(SOURCE_NODE_URI_FRAGMENT);
        String targetClassUriFragment = command.getProperties().get(TARGET_NODE_URI_FRAGMENT);

        return new AddDeploymentCompoundCommand(domain, modelUri, sourceClassUriFragment, targetClassUriFragment);
    }

}
