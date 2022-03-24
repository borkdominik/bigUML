package com.eclipsesource.uml.modelserver.commands.usecasediagram.component;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Component;

public class RemoveComponentCommand extends UmlSemanticElementCommand {

    protected final String semanticUriFragment;

    public RemoveComponentCommand(final EditingDomain domain, final URI modelUri, final String semanticUriFragment) {
        super(domain, modelUri);
        this.semanticUriFragment = semanticUriFragment;
    }

    @Override
    protected void doExecute() {
        Component componentToRemove = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment, Component.class);
        umlModel.getPackagedElements().remove(componentToRemove);
    }
}
