package com.eclipsesource.uml.modelserver.commands.deploymentdiagram.communicationpath;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.CommunicationPath;

public class RemoveCommunicationPathCommand extends UmlSemanticElementCommand {

    protected final String semanticUriFragment;

    public RemoveCommunicationPathCommand(final EditingDomain domain, final URI modelUri,
                                          final String semanticUriFragment) {
        super(domain, modelUri);
        this.semanticUriFragment = semanticUriFragment;
    }

    @Override
    protected void doExecute() {
        CommunicationPath communicationPathToRemove = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment,
                CommunicationPath.class);
        umlModel.getPackagedElements().remove(communicationPathToRemove);
    }
}
