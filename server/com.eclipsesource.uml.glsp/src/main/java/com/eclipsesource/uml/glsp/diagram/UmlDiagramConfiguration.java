/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
package com.eclipsesource.uml.glsp.diagram;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.eclipse.emf.ecore.EClass;
import org.eclipse.glsp.graph.DefaultTypes;
import org.eclipse.glsp.graph.GraphPackage;
import org.eclipse.glsp.server.diagram.BaseDiagramConfiguration;

import com.eclipsesource.uml.glsp.util.UmlConfig.Types;
import com.google.common.collect.Lists;
import org.eclipse.glsp.server.layout.ServerLayoutKind;
import org.eclipse.glsp.server.types.EdgeTypeHint;
import org.eclipse.glsp.server.types.ShapeTypeHint;

public class UmlDiagramConfiguration extends BaseDiagramConfiguration {

    @Override
    public String getDiagramType() { return "umldiagram"; }

    @Override
    public List<EdgeTypeHint> getEdgeTypeHints() {
        return Lists.newArrayList(
                // COMMONS
                createDefaultEdgeTypeHint(Types.COMMENT_EDGE),
                // CLASS DIAGRAM
                createDefaultEdgeTypeHint(Types.ASSOCIATION),
                // OBJECT DIAGRAM
                createDefaultEdgeTypeHint(Types.LINK),
                // ACTIVITY DIAGRAM
                createDefaultEdgeTypeHint(Types.CONTROLFLOW),
                createDefaultEdgeTypeHint(Types.EXCEPTIONHANDLER),
                // USECASE DIAGRAM
                createDefaultEdgeTypeHint(Types.EXTEND),
                createDefaultEdgeTypeHint(Types.INCLUDE),
                createDefaultEdgeTypeHint(Types.GENERALIZATION),
                // DEPLOYMENT DIAGRAM
                createDefaultEdgeTypeHint(Types.COMMUNICATION_PATH),
                createDefaultEdgeTypeHint(Types.DEPLOYMENT),
                // STATE MACHINE DIAGRAM
                createDefaultEdgeTypeHint(Types.TRANSITION)
        );
    }

    @Override
    public EdgeTypeHint createDefaultEdgeTypeHint(final String elementId) {
        List<String> allowed;

        switch (elementId) {
            // CLASS DIAGRAM
            case Types.ASSOCIATION:
                allowed = Lists.newArrayList(Types.CLASS);
                return new EdgeTypeHint(elementId, true, true, true, allowed, allowed);
            // ACTIVITY DIAGRAM
            case Types.CONTROLFLOW:
                List<String> from = new ArrayList<>();
                from.addAll(Types.ACTIONS);
                from.addAll(Types.CONTROL_NODES);
                from.add(Types.PARAMETER);
                from.add(Types.PIN_PORT);
                from.add(Types.CENTRALBUFFER);
                from.add(Types.DATASTORE);
                from.remove(Types.FINALNODE);
                from.remove(Types.FLOWFINALNODE);

                List<String> to = new ArrayList<>();
                to.addAll(Types.ACTIONS);
                to.addAll(Types.CONTROL_NODES);
                to.add(Types.PARAMETER);
                to.add(Types.PIN_PORT);
                to.add(Types.CENTRALBUFFER);
                to.add(Types.DATASTORE);
                to.remove(Types.INITIALNODE);
                return new EdgeTypeHint(elementId, true, true, true, from, to);
            case Types.EXCEPTIONHANDLER:
                return new EdgeTypeHint(elementId, false, true, false,
                        List.of(Types.ACTION, Types.CALL, Types.ACCEPTEVENT),
                        List.of(Types.PIN_PORT, Types.ACTIVITY));
            // USECASE DIAGRAM
            case Types.EXTEND:
                allowed = Lists.newArrayList(Types.USECASE, Types.EXTENSIONPOINT);
                return new EdgeTypeHint(elementId, true, true, true, allowed, allowed);
            case Types.INCLUDE:
                allowed = Lists.newArrayList(Types.USECASE);
                return new EdgeTypeHint(elementId, true, true, true, allowed, allowed);
            case Types.GENERALIZATION:
                from = Lists.newArrayList(Types.ACTOR);
                to = Lists.newArrayList(Types.USECASE);
                return new EdgeTypeHint(elementId, true, true, true, from, to);
            // DEPLOYMENT DIAGRAM
            case Types.COMMUNICATION_PATH:
                from = Lists.newArrayList(Types.DEPLOYMENT_NODE, Types.EXECUTION_ENVIRONMENT, Types.DEVICE);
                to = Lists.newArrayList(Types.DEPLOYMENT_NODE, Types.EXECUTION_ENVIRONMENT, Types.DEVICE, Types.ARTIFACT,
                        Types.DEPLOYMENT_SPECIFICATION);
                return new EdgeTypeHint(elementId, true, true, true, from, to);
            case Types.DEPLOYMENT:
                from = Lists.newArrayList(Types.ARTIFACT, Types.DEPLOYMENT_SPECIFICATION);
                to = Lists.newArrayList(Types.DEPLOYMENT_NODE, Types.DEVICE, Types.EXECUTION_ENVIRONMENT);
                return new EdgeTypeHint(elementId, true, true, true, from, to);
            // STATE MACHINE DIAGRAM
            case Types.TRANSITION:
                allowed = Lists.newArrayList(Types.STATE, Types.FINAL_STATE);
                allowed.addAll(Types.PSEUDOSTATES);
                return new EdgeTypeHint(elementId, true, true, true, allowed, allowed);
            // COMMENT
            case Types.COMMENT_EDGE:
                allowed = Lists.newArrayList();
                allowed.addAll(Types.LINKS_TO_COMMENT);
                return new EdgeTypeHint(elementId, true, true, true, List.of(Types.COMMENT),
                        allowed);
            // OBJECT DIAGRAM
            case Types.LINK:
                allowed = Lists.newArrayList(Types.OBJECT, Types.CLASS);
                return new EdgeTypeHint(elementId, true, true, true, allowed, allowed);
            default:
                break;
        }
        return new EdgeTypeHint(elementId, true, true, true, List.of(), List.of());
    }

    @Override
    public List<ShapeTypeHint> getShapeTypeHints() {
        List<ShapeTypeHint> hints = new ArrayList<>();
        //GRAPH
        hints.add(new ShapeTypeHint(DefaultTypes.GRAPH, false, false, false, false,
                List.of(Types.COMMENT, Types.CLASS, Types.ACTIVITY, Types.USECASE, Types.ACTOR, Types.PACKAGE, Types.COMPONENT,
                        Types.STATE_MACHINE, Types.DEPLOYMENT_NODE, Types.DEVICE, Types.ARTIFACT,
                        Types.EXECUTION_ENVIRONMENT, Types.OBJECT
                ))
        );

        // CLASS DIAGRAM
        hints.add(new ShapeTypeHint(Types.CLASS, true, true, false, false,
                List.of(Types.PROPERTY, Types.COMMENT)));
        hints.add(new ShapeTypeHint(Types.PROPERTY, false, true, false, true,
                List.of(Types.COMMENT)));

        // OBJECT DIAGRAM
        hints.add(new ShapeTypeHint(Types.OBJECT, true, true, false, false,
                List.of(Types.ATTRIBUTE)));
        hints.add(new ShapeTypeHint(Types.ATTRIBUTE, false, true, false, true));

        // USECASE DIAGRAM
        hints.add(new ShapeTypeHint(Types.PACKAGE, true, true, true, false,
                List.of(Types.ACTOR, Types.USECASE, Types.PACKAGE, Types.COMPONENT, Types.COMMENT)));
        hints.add(new ShapeTypeHint(Types.COMPONENT, true, true, true, false,
                List.of(Types.USECASE, Types.COMMENT)));
        hints.add(new ShapeTypeHint(Types.USECASE, true, true, false, false,
                List.of(Types.COMMENT)));
        hints.add(new ShapeTypeHint(Types.EXTENSIONPOINT, false, true, false, false));
        hints.add(new ShapeTypeHint(Types.ACTOR, true, true, false, false,
                List.of(Types.COMMENT)));

        // DEPLOYMENT DIAGRAM
        hints.add(new ShapeTypeHint(Types.DEPLOYMENT_NODE, true, true, true, true,
                List.of(Types.DEPLOYMENT_NODE, Types.ARTIFACT, Types.DEVICE,
                        Types.EXECUTION_ENVIRONMENT, Types.DEPLOYMENT_SPECIFICATION, Types.COMMENT)));
        hints.add(new ShapeTypeHint(Types.ARTIFACT, true, true, true, true,
                List.of(Types.DEPLOYMENT_SPECIFICATION, Types.COMMENT)));
        hints.add(new ShapeTypeHint(Types.EXECUTION_ENVIRONMENT, true, true, true, true,
                List.of(Types.DEPLOYMENT_NODE, Types.ARTIFACT, Types.DEVICE,
                        Types.EXECUTION_ENVIRONMENT, Types.DEPLOYMENT_SPECIFICATION, Types.COMMENT)));
        hints.add(new ShapeTypeHint(Types.DEVICE, true, true, true, true,
                List.of(Types.DEPLOYMENT_NODE, Types.ARTIFACT, Types.DEVICE,
                        Types.EXECUTION_ENVIRONMENT, Types.DEPLOYMENT_SPECIFICATION, Types.COMMENT)));
        hints.add(new ShapeTypeHint(Types.DEPLOYMENT_SPECIFICATION, true, true, true, true,
                List.of(Types.COMMENT)));

        // STATE MACHINE DIAGRAM
        hints.add(new ShapeTypeHint(Types.STATE_MACHINE, true, true, false, false,
                List.of(Types.STATE, Types.INITIAL_STATE, Types.DEEP_HISTORY, Types.SHALLOW_HISTORY, Types.FORK, Types.JOIN,
                        Types.JUNCTION, Types.CHOICE, Types.ENTRY_POINT, Types.EXIT_POINT, Types.TERMINATE, Types.FINAL_STATE,
                        Types.COMMENT)));
        hints.add(new ShapeTypeHint(Types.STATE, true, true, true, false,
                List.of(Types.STATE_ENTRY_ACTIVITY, Types.STATE_DO_ACTIVITY, Types.STATE_EXIT_ACTIVITY, Types.COMMENT)));
        hints.add(new ShapeTypeHint(Types.INITIAL_STATE, true, true, true, false,
                List.of(Types.COMMENT)));
        hints.add(new ShapeTypeHint(Types.DEEP_HISTORY, true, true, true, false,
                List.of(Types.COMMENT)));
        hints.add(new ShapeTypeHint(Types.SHALLOW_HISTORY, true, true, true, false,
                List.of(Types.COMMENT)));
        hints.add(new ShapeTypeHint(Types.FORK, true, true, true, false,
                List.of(Types.COMMENT)));
        hints.add(new ShapeTypeHint(Types.JOIN, true, true, true, false,
                List.of(Types.COMMENT)));
        hints.add(new ShapeTypeHint(Types.JUNCTION, true, true, true, false,
                List.of(Types.COMMENT)));
        hints.add(new ShapeTypeHint(Types.CHOICE, true, true, true, false,
                List.of(Types.COMMENT)));
        hints.add(new ShapeTypeHint(Types.STATE_ENTRY_ACTIVITY, false, true, false, true,
                List.of(Types.COMMENT)));
        hints.add(new ShapeTypeHint(Types.STATE_DO_ACTIVITY, false, true, false, true,
                List.of(Types.COMMENT)));
        hints.add(new ShapeTypeHint(Types.STATE_EXIT_ACTIVITY, false, true, false, true,
                List.of(Types.COMMENT)));
        hints.add(new ShapeTypeHint(Types.FINAL_STATE, true, true, true, false,
                List.of(Types.COMMENT)));
        hints.add(new ShapeTypeHint(Types.ENTRY_POINT, true, true, false, false,
                List.of(Types.COMMENT)));
        hints.add(new ShapeTypeHint(Types.EXIT_POINT, true, true, false, false,
                List.of(Types.COMMENT)));
        hints.add(new ShapeTypeHint(Types.TERMINATE, true, true, true, false,
                List.of(Types.COMMENT)));

        // ACTIVITY DIAGRAM
        hints.add(new ShapeTypeHint(Types.ACTIVITY, true, true, true, false,
            List.of(Types.ACTION, Types.ACCEPTEVENT, Types.TIMEEVENT, Types.SENDSIGNAL, Types.CALL, Types.INITIALNODE,
                    Types.FINALNODE, Types.FLOWFINALNODE, Types.DECISIONMERGENODE, Types.FORKJOINNODE,
                    Types.PARAMETER, Types.CENTRALBUFFER, Types.DATASTORE, Types.PARTITION, Types.CONDITION,
                    Types.INTERRUPTIBLEREGION, Types.COMMENT)));

        hints.add(new ShapeTypeHint(Types.PARTITION, true, true, true, false,
                List.of(Types.ACTION, Types.ACCEPTEVENT, Types.TIMEEVENT, Types.SENDSIGNAL, Types.CALL, Types.INITIALNODE,
                        Types.FINALNODE, Types.FLOWFINALNODE, Types.DECISIONMERGENODE, Types.FORKJOINNODE,
                        Types.PARTITION, Types.INTERRUPTIBLEREGION, Types.COMMENT)));

        hints.add(new ShapeTypeHint(Types.INTERRUPTIBLEREGION, true, true, true, false,
                List.of(Types.ACTION, Types.ACCEPTEVENT, Types.TIMEEVENT, Types.SENDSIGNAL, Types.CALL, Types.INITIALNODE,
                        Types.FINALNODE, Types.FLOWFINALNODE, Types.DECISIONMERGENODE, Types.FORKJOINNODE,
                        Types.PARTITION, Types.INTERRUPTIBLEREGION, Types.COMMENT)));

        hints.add(new ShapeTypeHint(Types.ACTION, true, true, false, false, List.of(Types.COMMENT, Types.PIN)));
        hints.add(new ShapeTypeHint(Types.CALL, true, true, false, false, List.of(Types.COMMENT, Types.PIN)));
        hints.add(new ShapeTypeHint(Types.ACCEPTEVENT, true, true, false, false, List.of(Types.COMMENT, Types.PIN)));
        hints.add(new ShapeTypeHint(Types.TIMEEVENT, true, true, false, false, List.of(Types.COMMENT, Types.PIN)));
        hints.add(new ShapeTypeHint(Types.SENDSIGNAL, true, true, false, false, List.of(Types.COMMENT, Types.PIN)));

        hints.add(new ShapeTypeHint(Types.INITIALNODE, true, true, false, false));
        hints.add(new ShapeTypeHint(Types.FINALNODE, true, true, false, false, List.of(Types.COMMENT)));
        hints.add(new ShapeTypeHint(Types.FLOWFINALNODE, true, true, false, false, List.of(Types.COMMENT)));
        hints.add(new ShapeTypeHint(Types.DECISIONMERGENODE, true, true, false, false, List.of(Types.COMMENT)));
        hints.add(new ShapeTypeHint(Types.FORKJOINNODE, true, true, false, false, List.of(Types.COMMENT)));

        hints.add(new ShapeTypeHint(Types.PARAMETER, true, true, false, false, List.of(Types.COMMENT)));
        hints.add(new ShapeTypeHint(Types.PIN, true, true, false, false, List.of(Types.COMMENT)));
        hints.add(new ShapeTypeHint(Types.CENTRALBUFFER, true, true, false, false, List.of(Types.COMMENT)));
        hints.add(new ShapeTypeHint(Types.DATASTORE, true, true, false, false, List.of(Types.COMMENT)));

        hints.add(new ShapeTypeHint(Types.CONDITION, true, true, false, false));

        // Comment
        hints.add(new ShapeTypeHint(Types.COMMENT, true, true, false, false));

        return hints;
   }

    @Override
    public Map<String, EClass> getTypeMappings() {
        Map<String, EClass> mappings = DefaultTypes.getDefaultTypeMappings();

        // COMMONS
        mappings.put(Types.LABEL_NAME, GraphPackage.Literals.GLABEL);
        mappings.put(Types.LABEL_TEXT, GraphPackage.Literals.GLABEL);
        mappings.put(Types.LABEL_EDGE_NAME, GraphPackage.Literals.GLABEL);
        mappings.put(Types.LABEL_EDGE_MULTIPLICITY, GraphPackage.Literals.GLABEL);
        mappings.put(Types.COMP, GraphPackage.Literals.GCOMPARTMENT);
        mappings.put(Types.COMP_HEADER, GraphPackage.Literals.GCOMPARTMENT);
        mappings.put(Types.LABEL_ICON, GraphPackage.Literals.GCOMPARTMENT);
        mappings.put(Types.COMMENT, GraphPackage.Literals.GNODE);
        mappings.put(Types.COMMENT_EDGE, GraphPackage.Literals.GEDGE);

        // CLASS DIAGRAM
        mappings.put(Types.ICON_CLASS, GraphPackage.Literals.GCOMPARTMENT);
        mappings.put(Types.CLASS, GraphPackage.Literals.GNODE);
        mappings.put(Types.PROPERTY, GraphPackage.Literals.GLABEL);
        mappings.put(Types.ASSOCIATION, GraphPackage.Literals.GEDGE);

        // OBJECT DIAGRAM
        mappings.put(Types.ICON_OBJECT, GraphPackage.Literals.GCOMPARTMENT);
        mappings.put(Types.OBJECT, GraphPackage.Literals.GNODE);
        mappings.put(Types.LINK, GraphPackage.Literals.GEDGE);
        mappings.put(Types.ATTRIBUTE, GraphPackage.Literals.GLABEL);

        // ACTIVITY DIAGRAM
        mappings.put(Types.ACTIVITY, GraphPackage.Literals.GNODE);
        mappings.put(Types.ICON_ACTIVITY, GraphPackage.Literals.GCOMPARTMENT);
        mappings.put(Types.PARTITION, GraphPackage.Literals.GNODE);
        mappings.put(Types.CONTROLFLOW, GraphPackage.Literals.GEDGE);
        Types.ACTIONS.forEach(a -> mappings.put(a, GraphPackage.Literals.GNODE));
        Types.CONTROL_NODES.forEach(node -> mappings.put(node, GraphPackage.Literals.GNODE));
        // mappings.put(Types.CONDITION, GraphPackage.Literals.GLABEL);
        mappings.put(Types.PARAMETER, GraphPackage.Literals.GNODE);
        mappings.put(Types.PIN, GraphPackage.Literals.GNODE);
        mappings.put(Types.CENTRALBUFFER, GraphPackage.Literals.GNODE);
        mappings.put(Types.DATASTORE, GraphPackage.Literals.GNODE);
        mappings.put(Types.EXCEPTIONHANDLER, GraphPackage.Literals.GEDGE);

        // USECASE DIAGRAM
        mappings.put(Types.ICON_PACKAGE, GraphPackage.Literals.GCOMPARTMENT);
        mappings.put(Types.PACKAGE, GraphPackage.Literals.GNODE);
        mappings.put(Types.ICON_USECASE, GraphPackage.Literals.GCOMPARTMENT);
        mappings.put(Types.USECASE, GraphPackage.Literals.GNODE);
        mappings.put(Types.ICON_COMPONENT, GraphPackage.Literals.GCOMPARTMENT);
        mappings.put(Types.COMPONENT, GraphPackage.Literals.GNODE);
        mappings.put(Types.ICON_ACTOR, GraphPackage.Literals.GCOMPARTMENT);
        mappings.put(Types.ACTOR, GraphPackage.Literals.GNODE);
        mappings.put(Types.EXTEND, GraphPackage.Literals.GEDGE);
        mappings.put(Types.INCLUDE, GraphPackage.Literals.GEDGE);
        mappings.put(Types.GENERALIZATION, GraphPackage.Literals.GEDGE);

        // DEPLOYMENT DIAGRAM
        mappings.put(Types.ICON_DEPLOYMENT_NODE, GraphPackage.Literals.GCOMPARTMENT);
        mappings.put(Types.DEPLOYMENT_NODE, GraphPackage.Literals.GNODE);
        mappings.put(Types.ICON_ARTIFACT, GraphPackage.Literals.GCOMPARTMENT);
        mappings.put(Types.ARTIFACT, GraphPackage.Literals.GNODE);
        mappings.put(Types.ICON_DEPLOYMENT_SPECIFICATION, GraphPackage.Literals.GCOMPARTMENT);
        mappings.put(Types.DEPLOYMENT_SPECIFICATION, GraphPackage.Literals.GNODE);
        mappings.put(Types.ICON_EXECUTION_ENVIRONMENT, GraphPackage.Literals.GCOMPARTMENT);
        mappings.put(Types.EXECUTION_ENVIRONMENT, GraphPackage.Literals.GNODE);
        mappings.put(Types.ICON_DEVICE, GraphPackage.Literals.GCOMPARTMENT);
        mappings.put(Types.DEVICE, GraphPackage.Literals.GNODE);
        mappings.put(Types.COMMUNICATION_PATH, GraphPackage.Literals.GEDGE);
        mappings.put(Types.DEPLOYMENT, GraphPackage.Literals.GEDGE);

        // STATE MACHINE DIAGRAM
        mappings.put(Types.ICON_STATE_MACHINE, GraphPackage.Literals.GCOMPARTMENT);
        mappings.put(Types.STATE_MACHINE, GraphPackage.Literals.GNODE);
        mappings.put(Types.ICON_STATE, GraphPackage.Literals.GCOMPARTMENT);
        mappings.put(Types.STATE, GraphPackage.Literals.GNODE);
        mappings.put(Types.LABEL_VERTEX_NAME, GraphPackage.Literals.GLABEL);
        mappings.put(Types.INITIAL_STATE, GraphPackage.Literals.GNODE);
        mappings.put(Types.DEEP_HISTORY, GraphPackage.Literals.GNODE);
        mappings.put(Types.SHALLOW_HISTORY, GraphPackage.Literals.GNODE);
        mappings.put(Types.JOIN, GraphPackage.Literals.GNODE);
        mappings.put(Types.FORK, GraphPackage.Literals.GNODE);
        mappings.put(Types.JUNCTION, GraphPackage.Literals.GNODE);
        mappings.put(Types.CHOICE, GraphPackage.Literals.GNODE);
        mappings.put(Types.ENTRY_POINT, GraphPackage.Literals.GNODE);
        mappings.put(Types.EXIT_POINT, GraphPackage.Literals.GNODE);
        mappings.put(Types.TERMINATE, GraphPackage.Literals.GNODE);
        mappings.put(Types.FINAL_STATE, GraphPackage.Literals.GNODE);
        mappings.put(Types.STATE_ENTRY_ACTIVITY, GraphPackage.Literals.GLABEL);
        mappings.put(Types.STATE_DO_ACTIVITY, GraphPackage.Literals.GLABEL);
        mappings.put(Types.STATE_EXIT_ACTIVITY, GraphPackage.Literals.GLABEL);
        mappings.put(Types.TRANSITION, GraphPackage.Literals.GEDGE);

        return mappings;
    }

    @Override
    public ServerLayoutKind getLayoutKind() { return ServerLayoutKind.MANUAL; }

}
