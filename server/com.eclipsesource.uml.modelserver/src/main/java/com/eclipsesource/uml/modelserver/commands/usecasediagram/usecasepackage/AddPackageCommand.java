package com.eclipsesource.uml.modelserver.commands.usecasediagram.usecasepackage;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Package;
import org.eclipse.uml2.uml.UMLFactory;

public class AddPackageCommand extends UmlSemanticElementCommand {

    protected final Package newPackage;

    public AddPackageCommand(final EditingDomain domain, final URI modelUri) {
        super(domain, modelUri);
        this.newPackage = UMLFactory.eINSTANCE.createPackage();
    }

    @Override
    protected void doExecute() {
        newPackage.setName(UmlSemanticCommandUtil.getNewPackageName(umlModel));
        umlModel.getPackagedElements().add(newPackage);
    }

    public Package getNewPackage() {
        return newPackage;
    }
}
