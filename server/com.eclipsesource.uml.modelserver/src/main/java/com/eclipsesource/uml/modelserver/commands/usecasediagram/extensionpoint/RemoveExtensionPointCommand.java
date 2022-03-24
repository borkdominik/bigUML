package com.eclipsesource.uml.modelserver.commands.usecasediagram.extensionpoint;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.ExtensionPoint;
import org.eclipse.uml2.uml.UseCase;

public class RemoveExtensionPointCommand extends UmlSemanticElementCommand {

    protected final String semanticUriFragment;

    public RemoveExtensionPointCommand(final EditingDomain domain, final URI modelUri,
                                       final String semanticUriFragment) {
        super(domain, modelUri);
        this.semanticUriFragment = semanticUriFragment;
    }

    @Override
    protected void doExecute() {
        ExtensionPoint epToRemove = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment,
                ExtensionPoint.class);
        UseCase parent = epToRemove.getUseCase();
        parent.getExtensionPoints().remove(epToRemove);
    }
}
