package com.eclipsesource.uml.modelserver.commands.usecasediagram.usecasepackage;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Package;

public class RemovePackageCommand extends UmlSemanticElementCommand {

    protected final String semanticUriFragment;

    public RemovePackageCommand(final EditingDomain domain, final URI modelUri, final String semanticUriFragment) {
        super(domain, modelUri);
        this.semanticUriFragment = semanticUriFragment;
    }

    @Override
    protected void doExecute() {
        Package packageToRemove = UmlSemanticCommandUtil.getElement(umlModel, semanticUriFragment, Package.class);
        umlModel.getPackagedElements().remove(packageToRemove);
    }
}
