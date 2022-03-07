package com.eclipsesource.uml.modelserver.commands.objectdiagram.object;

import com.eclipsesource.uml.modelserver.commands.commons.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlSemanticCommandUtil;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.uml2.uml.Class;
import org.eclipse.uml2.uml.NamedElement;
import org.eclipse.uml2.uml.PackageableElement;
import org.eclipse.uml2.uml.UMLFactory;

public class AddObjectCommand extends UmlSemanticElementCommand {

    // protected final Class newObject;
    protected final NamedElement newObject;

    public AddObjectCommand(final EditingDomain domain, final URI modelUri){
        super(domain, modelUri);
        //this.newObject = UMLFactory.eINSTANCE.createInstanceSpecification();
        this.newObject = UMLFactory.eINSTANCE.createClass();
    }

    @Override
    protected void doExecute() {
        newObject.setName(UmlSemanticCommandUtil.getNewObjectName(umlModel));
        umlModel.getPackagedElements().add((PackageableElement) newObject);
    }

    /*public Class getNewObject() {
        return newObject;
    }*/
    public NamedElement getNewObject() {
        return newObject;
    }

}
